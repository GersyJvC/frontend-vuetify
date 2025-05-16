<template>
  <v-container>
    <!-- Tabs -->
    <v-tabs v-model="tab" background-color="primary" dark>
      <v-tab>Login</v-tab>
      <v-tab>Registro</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <!-- LOGIN -->
      <v-tab-item>
        <v-form @submit.prevent="submitLogin">
          <v-text-field v-model="loginEmail" label="Correo" type="email" required></v-text-field>
          <v-text-field v-model="loginPassword" label="Contraseña" type="password" required></v-text-field>
          <v-btn type="submit" color="primary">Iniciar Sesión</v-btn>
          <v-alert v-if="loginError" type="error" class="mt-2">{{ loginError }}</v-alert>
        </v-form>

        <!-- Botón Google -->
        <v-divider class="my-4"></v-divider>
        <div id="g_id_signin"></div>
      </v-tab-item>

      <!-- REGISTRO -->
      <v-tab-item>
        <v-form @submit.prevent="submitRegister">
          <v-text-field v-model="registerNombre" label="Nombre" required></v-text-field>
          <v-text-field v-model="registerEmail" label="Correo" type="email" required></v-text-field>
          <v-text-field v-model="registerPassword" label="Contraseña" type="password" required></v-text-field>
          <v-btn type="submit" color="primary">Registrarse</v-btn>
          <v-alert v-if="registerError" type="error" class="mt-2">{{ registerError }}</v-alert>
          <v-alert v-if="registerSuccess" type="success" class="mt-2">{{ registerSuccess }}</v-alert>
        </v-form>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const tab = ref(0)
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')
const registerNombre = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerError = ref('')
const registerSuccess = ref('')

// Obtener CSRF
const getCsrfToken = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/csrf-token', {
      credentials: 'include'
    })
    const data = await res.json()
    return data.csrfToken
  } catch {
    return null
  }
}

const submitLogin = async () => {
  loginError.value = ''
  const csrfToken = await getCsrfToken()
  if (!csrfToken) {
    loginError.value = 'No se pudo obtener token CSRF'
    return
  }
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      credentials: 'include',
      body: JSON.stringify({
        email: loginEmail.value,
        password: loginPassword.value
      })
    })
    const data = await res.json()
    if (!res.ok) {
      loginError.value = data.message || 'Error al iniciar sesión'
    } else {
      alert(`Bienvenido, ${data.user.nombre}!`)
    }
  } catch {
    loginError.value = 'Error de conexión'
  }
}

const submitRegister = async () => {
  registerError.value = ''
  registerSuccess.value = ''
  const csrfToken = await getCsrfToken()
  if (!csrfToken) {
    registerError.value = 'No se pudo obtener token CSRF'
    return
  }
  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      credentials: 'include',
      body: JSON.stringify({
        nombre: registerNombre.value,
        email: registerEmail.value,
        password: registerPassword.value
      })
    })
    const data = await res.json()
    if (!res.ok) {
      registerError.value = data.message || 'Error al registrarse'
    } else {
      registerSuccess.value = `Usuario ${data.user.nombre} registrado con éxito!`
    }
  } catch {
    registerError.value = 'Error de conexión'
  }
}

// Inicializar botón de Google
onMounted(() => {
  window.google?.accounts.id.initialize({
    client_id: 'TU_CLIENT_ID_DE_GOOGLE',
    callback: handleCredentialResponse
  })

  window.google?.accounts.id.renderButton(
    document.getElementById('g_id_signin'),
    { theme: 'outline', size: 'large' }
  )
})

// Enviar ID Token al backend
async function handleCredentialResponse(response) {
  const csrfToken = await getCsrfToken()
  const res = await fetch('http://localhost:3000/api/auth/google/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    credentials: 'include',
    body: JSON.stringify({
      credential: response.credential
    })
  })

  const data = await res.json()
  if (res.ok) {
    alert(`Bienvenido, ${data.user.nombre}`)
  } else {
    alert('Error al iniciar sesión con Google')
  }
}
</script>

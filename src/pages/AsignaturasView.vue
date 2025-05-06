<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Buscar Asignatura</v-card-title>

      <v-text-field
        label="Clave de la asignatura"
        v-model="clave"
        @keyup.enter="buscarAsignatura"
        outlined
      />
      <v-btn color="primary" @click="buscarAsignatura">Buscar</v-btn>
      <v-btn color="secondary" class="ml-2" @click="dialogAgregar = true">Agregar</v-btn>

      <v-divider class="my-4" />

      <div v-if="asignatura">
        <v-card-subtitle>Información</v-card-subtitle>
        <v-text-field v-model="asignatura.nombre" label="Nombre" outlined />
        <v-text-field v-model="asignatura.clave" label="Clave" outlined disabled />

        <v-card-subtitle class="mt-4">Docentes</v-card-subtitle>
        <v-list>
          <v-list-item v-for="doc in asignatura.docentes" :key="doc.numEmpleado">
            <v-list-item-content>
              <v-list-item-title>{{ doc.nombre }} - {{ doc.correo }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-card-subtitle class="mt-4">Estudiantes</v-card-subtitle>
        <v-list>
          <v-list-item v-for="estu in asignatura.estudantes" :key="estu.matricula">
            <v-list-item-content>
              <v-list-item-title>{{ estu.nombre }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-btn color="success" class="mt-2" @click="guardarCambios">Guardar</v-btn>
        <v-btn color="error" class="ml-2" @click="eliminarAsignatura">Eliminar</v-btn>
      </div>

      <div v-else-if="buscado">
        <v-alert type="error">Asignatura no encontrada.</v-alert>
      </div>

      <!-- Modal para nueva asignatura -->
      <v-dialog v-model="dialogAgregar" max-width="500px">
        <v-card>
          <v-card-title>Nueva Asignatura</v-card-title>
          <v-card-text>
            <v-text-field v-model="nuevaAsignatura.clave" label="Clave" />
            <v-text-field v-model="nuevaAsignatura.nombre" label="Nombre" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="crearAsignatura">Guardar</v-btn>
            <v-btn text @click="dialogAgregar = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'AsignaturasView',
  setup() {
    const clave = ref('')
    const asignatura = ref(null)
    const buscado = ref(false)
    const dialogAgregar = ref(false)

    const nuevaAsignatura = ref({
      clave: '',
      nombre: ''
    })

    const buscarAsignatura = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/asignaturas/clave/${clave.value}`)
        asignatura.value = res.data
        buscado.value = true
      } catch (error) {
        console.error('Error al buscar asignatura:', error)
        asignatura.value = null
        buscado.value = true
      }
    }

    const guardarCambios = async () => {
      try {
        await axios.put(`http://localhost:3000/api/asignaturas/${asignatura.value.clave}`, {
          nombre: asignatura.value.nombre
        })
        alert('Cambios guardados')
      } catch (error) {
        alert('Error al guardar')
      }
    }

    const eliminarAsignatura = async () => {
      try {
        await axios.delete(`http://localhost:3000/api/asignaturas/${asignatura.value.clave}`)
        asignatura.value = null
        clave.value = ''
        alert('Asignatura eliminada')
      } catch (error) {
        alert('No se pudo eliminar')
      }
    }

    const crearAsignatura = async () => {
      try {
        await axios.post('http://localhost:3000/api/asignaturas', nuevaAsignatura.value)
        alert('Asignatura creada')
        dialogAgregar.value = false
        nuevaAsignatura.value = { clave: '', nombre: '' }
      } catch (error) {
        alert('Error al crear asignatura')
      }
    }

    return {
      clave,
      asignatura,
      buscado,
      buscarAsignatura,
      guardarCambios,
      eliminarAsignatura,
      dialogAgregar,
      nuevaAsignatura,
      crearAsignatura
    }
  }
}
</script>

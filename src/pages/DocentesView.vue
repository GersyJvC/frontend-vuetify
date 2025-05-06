<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-card-title>Buscar Docente</v-card-title>

      <v-text-field
        label="Nombre del docente"
        v-model="nombre"
        @keyup.enter="buscarDocente"
        outlined
      />

      <v-btn color="primary" @click="buscarDocente">Buscar</v-btn>
      <v-btn color="secondary" class="ml-2" @click="dialogAgregar = true">Agregar</v-btn>

      <v-divider class="my-4" />

      <div v-if="docente">
        <v-card-title>Editar Docente</v-card-title>

        <v-text-field label="Nombre" v-model="docente.nombre" outlined />
        <v-text-field label="Correo" v-model="docente.email" outlined />

        <v-btn color="success" class="mr-2" @click="guardarCambios">Guardar cambios</v-btn>
        <v-btn color="error" @click="eliminarDocente">Eliminar docente</v-btn>

        <v-divider class="my-4" />

        <v-card-subtitle>Asignaturas y Estudiantes</v-card-subtitle>

        <v-list>
          <v-list-item v-for="asig in docente.asignaturas" :key="asig.id">
            <v-list-item-content>
              <v-list-item-title>
                {{ asig.nombre }} ({{ asig.clave }})
              </v-list-item-title>
              <v-list-item-subtitle>
                Estudiantes:
                <span v-if="asig.estudantes && asig.estudantes.length">
                  <span
                    v-for="estu in asig.estudantes"
                    :key="estu.id"
                    class="font-weight-medium"
                  >
                    {{ estu.nombre }} &nbsp;
                  </span>
                </span>
                <span v-else>No hay estudiantes inscritos</span>
              </v-list-item-subtitle>
            </v-list-item-content>

            <template #append>
              <v-btn color="error" @click="eliminarAsignatura(asig.id)" variant="text">
                <v-icon left>mdi-delete</v-icon>
                Quitar
              </v-btn>
            </template>
          </v-list-item>
        </v-list>

        <!-- Selector para agregar asignatura -->
        <v-select
  v-model="asignaturaSeleccionada"
  :items="asignaturasDisponibles"
  item-title="nombre"
  item-value="id"
  label="Seleccionar asignatura"
  outlined
  dense
  return-object
  class="mt-4"
/>


        <v-btn color="primary" class="mt-2" @click="agregarAsignatura">Agregar Asignatura</v-btn>
      </div>

      <div v-else-if="buscado">
        <v-alert type="error" class="mt-4">Docente no encontrado.</v-alert>
      </div>
    </v-card>

    <!-- Modal para agregar nuevo docente -->
    <v-dialog v-model="dialogAgregar" max-width="500px">
      <v-card>
        <v-card-title>Nuevo Docente</v-card-title>
        <v-card-text>
          <v-text-field label="Nombre" v-model="nuevoDocente.nombre" outlined />
          <v-text-field label="Correo" v-model="nuevoDocente.email" outlined />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="crearDocente">Guardar</v-btn>
          <v-btn text @click="dialogAgregar = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  name: 'DocentesView',
  setup() {
    const nombre = ref('')
    const docente = ref(null)
    const buscado = ref(false)

    const dialogAgregar = ref(false)
    const nuevoDocente = ref({
      nombre: '',
      email: ''
    })

    const asignaturasDisponibles = ref([])
    const asignaturaSeleccionada = ref(null)

    const obtenerAsignaturas = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/asignaturas')
        asignaturasDisponibles.value = res.data
      } catch (error) {
        console.error('Error al obtener asignaturas:', error)
      }
    }

    const buscarDocente = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/docentes/nombre/${nombre.value}`)
        docente.value = res.data
        buscado.value = true
        obtenerAsignaturas()
      } catch (error) {
        console.error('Error al obtener docente:', error)
        docente.value = null
        buscado.value = true
      }
    }

    const guardarCambios = async () => {
      try {
        await axios.put(`http://localhost:3000/api/docentes/${docente.value.id}`, {
          nombre: docente.value.nombre,
          email: docente.value.email
        })
        alert('Cambios guardados correctamente')
      } catch (error) {
        console.error('Error al guardar cambios:', error)
        alert('Error al guardar los cambios')
      }
    }

    const eliminarDocente = async () => {
      try {
        await axios.delete(`http://localhost:3000/api/docentes/${docente.value.id}`)
        docente.value = null
        nombre.value = ''
        alert('Docente eliminado')
      } catch (error) {
        console.error('Error al eliminar docente:', error)
        alert('No se pudo eliminar el docente')
      }
    }

    const eliminarAsignatura = async (asignaturaId) => {
      try {
        await axios.delete(`http://localhost:3000/api/docentes/${docente.value.id}/asignaturas/${asignaturaId}`)
        await buscarDocente()
      } catch (error) {
        console.error('Error al eliminar asignatura:', error)
      }
    }

    const agregarAsignatura = async () => {
  try {
    if (!asignaturaSeleccionada.value) return;
    await axios.post(`http://localhost:3000/api/docentes/${docente.value.id}/asignaturas/${asignaturaSeleccionada.value.id}`);
    await buscarDocente();
    asignaturaSeleccionada.value = null;
  } catch (error) {
    console.error('Error al agregar asignatura:', error);
  }
};

    const crearDocente = async () => {
      try {
        await axios.post('http://localhost:3000/api/docentes', {
          nombre: nuevoDocente.value.nombre,
          email: nuevoDocente.value.email
        })
        alert('Docente creado correctamente')
        dialogAgregar.value = false
        nuevoDocente.value = { nombre: '', email: '' }
      } catch (error) {
        console.error('Error al crear docente:', error)
        alert('No se pudo crear el docente')
      }
    }

    onMounted(obtenerAsignaturas)

    return {
      nombre,
      docente,
      buscado,
      buscarDocente,
      guardarCambios,
      eliminarDocente,
      eliminarAsignatura,
      dialogAgregar,
      nuevoDocente,
      crearDocente,
      asignaturasDisponibles,
      asignaturaSeleccionada,
      agregarAsignatura
    }
  }
}
</script>

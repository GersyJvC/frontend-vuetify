<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-card-title>Buscar Estudiante</v-card-title>

      <v-text-field
        label="Matrícula del estudiante"
        v-model="matricula"
        @keyup.enter="buscarEstudante"
        outlined
      />

      <v-btn color="primary" @click="buscarEstudante">Buscar</v-btn>
      <v-btn color="secondary" class="ml-2" @click="dialogAgregar = true">Agregar</v-btn>

      <v-divider class="my-4" />

      <div v-if="estudante">
        <v-card-title>Editar Estudiante</v-card-title>

        <v-text-field
          label="Nombre"
          v-model="estudante.nombre"
          outlined
        />

        <v-text-field
          label="Correo"
          v-model="estudante.correo"
          outlined
        />

        <v-btn color="success" class="mr-2" @click="guardarCambios">Guardar cambios</v-btn>
        <v-btn color="error" @click="eliminarEstudante">Eliminar estudiante</v-btn>

        <v-divider class="my-4" />

        <v-card-subtitle>Asignaturas y Docentes</v-card-subtitle>

        <v-list>
          <v-list-item
            v-for="asig in estudante.asignaturas"
            :key="asig.clave"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ asig.nombre }} ({{ asig.clave }})
              </v-list-item-title>
              <v-list-item-subtitle>
                Docentes:
                <span
                  v-for="doc in asig.docentes"
                  :key="doc.numEmpleado"
                  class="font-weight-medium"
                >
                  {{ doc.nombre }} &nbsp;
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>

            <template #append>
              <v-btn
                color="error"
                @click="eliminarAsignatura(asig.clave)"
                variant="text"
              >
                <v-icon left>mdi-delete</v-icon>
                Quitar
              </v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-divider class="my-4" />

        <v-text-field
          label="Clave de asignatura a agregar"
          v-model="nuevaClave"
          outlined
        />
        <v-btn color="primary" @click="agregarAsignatura">Agregar asignatura</v-btn>
      </div>

      <div v-else-if="buscado">
        <v-alert type="error" class="mt-4">
          Estudiante no encontrado.
        </v-alert>
      </div>
    </v-card>

    <!-- Modal para agregar nuevo estudiante -->
    <v-dialog v-model="dialogAgregar" max-width="500px">
      <v-card>
        <v-card-title>Nuevo Estudiante</v-card-title>
        <v-card-text>
          <v-text-field
            label="Matrícula"
            v-model="nuevoEstudiante.matricula"
            outlined
          />
          <v-text-field
            label="Nombre"
            v-model="nuevoEstudiante.nombre"
            outlined
          />
          <v-text-field
            label="Correo"
            v-model="nuevoEstudiante.correo"
            outlined
            />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="crearEstudiante">Guardar</v-btn>
          <v-btn text @click="dialogAgregar = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'
import { ref } from 'vue'

export default {
  name: 'EstudantesView',
  setup() {
    const matricula = ref('')
    const estudante = ref(null)
    const buscado = ref(false)
    const nuevaClave = ref('')

    const dialogAgregar = ref(false)
    const nuevoEstudiante = ref({
      matricula: '',
      nombre: ''
    })

    const buscarEstudante = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/estudantes/${matricula.value}`)
        estudante.value = res.data
        buscado.value = true
      } catch (error) {
        console.error('Error al obtener estudiante:', error)
        estudante.value = null
        buscado.value = true
      }
    }

    const guardarCambios = async () => {
      try {
        await axios.put(`http://localhost:3000/api/estudantes/${matricula.value}`, {
          nombre: estudante.value.nombre,
          correo: estudante.value.correo
        })
        alert('Cambios guardados correctamente')
      } catch (error) {
        console.error('Error al guardar cambios:', error)
        alert('Error al guardar los cambios')
      }
    }

    const eliminarEstudante = async () => {
      try {
        await axios.delete(`http://localhost:3000/api/estudantes/${matricula.value}`)
        estudante.value = null
        matricula.value = ''
        alert('Estudiante eliminado')
      } catch (error) {
        console.error('Error al eliminar estudiante:', error)
        alert('No se pudo eliminar el estudiante')
      }
    }

    const eliminarAsignatura = async (clave) => {
      try {
        await axios.delete(`http://localhost:3000/api/estudantes/${matricula.value}/asignaturas/${clave}`)
        await buscarEstudante()
      } catch (error) {
        console.error('Error al eliminar asignatura:', error)
      }
    }

    const agregarAsignatura = async () => {
      try {
        await axios.post(`http://localhost:3000/api/estudantes/${matricula.value}/asignaturas`, {
          clave: nuevaClave.value
        })
        nuevaClave.value = ''
        await buscarEstudante()
      } catch (error) {
        console.error('Error al agregar asignatura:', error)
      }
    }

    const crearEstudiante = async () => {
      try {
        await axios.post('http://localhost:3000/api/estudantes', {
          matricula: nuevoEstudiante.value.matricula,
          nombre: nuevoEstudiante.value.nombre,
          correo: nuevoEstudiante.value.correo
        })
        alert('Estudiante creado correctamente')
        dialogAgregar.value = false
        nuevoEstudiante.value = { matricula: '', nombre: '', correo: '' }
      } catch (error) {
        console.error('Error al crear estudiante:', error)
        alert('No se pudo crear el estudiante')
      }
    }

    return {
      matricula,
      estudante,
      buscarEstudante,
      guardarCambios,
      eliminarEstudante,
      eliminarAsignatura,
      agregarAsignatura,
      nuevaClave,
      buscado,
      dialogAgregar,
      nuevoEstudiante,
      crearEstudiante
    }
  }
}
</script>

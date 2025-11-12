pipeline {
    agent any

    stages {
        stage('Parando los servicios...') {
            steps {
                bat '''
                    docker compose -p ${env.COMPOSE_PROJECT_NAME} down --volumes || exit /b 0
                '''
            }
        }

        stage('Eliminando imágenes anteriores...') {
            steps {
                bat '''
                    for /f "tokens=*" %%i in ('docker images --filter "label=com.docker.compose.project=${env.COMPOSE_PROJECT_NAME}" -q') do (
                        docker rmi -f %%i
                    )
                    if errorlevel 1 (
                        echo No hay imagenes por eliminar
                    ) else (
                        echo Imagenes eliminadas correctamente
                    )
                '''
            }
        }

        stage('Obteniendo actualización...') {
            steps {
                checkout scm
            }
        }

        // Construir y levantar los servicios (usa el nombre de tu proyecto)
        stage('Construyendo y desplegando servicios...') {
            steps {
                bat '''
                    docker compose -p ${env.COMPOSE_PROJECT_NAME} up --build -d
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado con éxito'
        }

        failure {
            echo 'Hubo un error al ejecutar el pipeline'
        }

        always {
            echo 'Pipeline finalizado'
        }
    }
}
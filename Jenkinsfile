pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'sgu-camc-10c' 
    }

    stages {
        stage('Parando los servicios...') {
            steps {
                bat """
                    rem Le quitamos --volumes para no borrar el volumen externo
                    docker compose -p ${env.COMPOSE_PROJECT_NAME} down || exit /b 0
                """
            }
        }

        stage('Eliminando imágenes anteriores...') {
            steps {
                bat """
                    for /f "tokens=*" %%i in ('docker images --filter "label=com.docker.compose.project=${env.COMPOSE_PROJECT_NAME}" -q') do (
                        docker rmi -f %%i
                    )
                    if errorlevel 1 (
                        echo No hay imagenes por eliminar
                    ) else (
                        echo Imagenes eliminadas correctamente
                    )
                """
            }
        }

        stage('Obteniendo actualización...') {
            steps {
                checkout scm
            }
        }

        stage('Construyendo y desplegando servicios...') {
            steps {
                bat """
                    rem --- INICIO DE LA CORRECCIÓN ---
                    rem Añadimos --wait para que Jenkins espere
                    rem hasta que el healthcheck de la BD y el backend estén listos.
                    docker compose -p ${env.COMPOSE_PROJECT_NAME} up --build -d --wait
                    rem --- FIN DE LA CORRECCIÓN ---
                """
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
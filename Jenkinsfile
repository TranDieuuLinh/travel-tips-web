pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building...'
            }
        }

        stage('Test') {
            steps {
                echo 'Testing...'
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'b5057049-8fed-4547-85d6-3b5cd44c66b8',
                    usernameVariable: 'GIT_USERNAME',
                    passwordVariable: 'GIT_PASSWORD'
                )]) {
                    dir('packages/frontend') {
                        sh '''
                        npm install
                        npm run build
                        '''

                        sh '''
                        # Frontend: try restart, otherwise start
                        pm2 restart frontend || PORT=3000 HOST=0.0.0.0 pm2 start npm --name frontend -- start --prefix packages/frontend

                        # Backend: try restart, otherwise start
                        pm2 restart backend || pm2 start packages/backend/src/server.ts --name backend --interpreter ts-node
                        '''
                    }
                }
            }
        }
    }
}

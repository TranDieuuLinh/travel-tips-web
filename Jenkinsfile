pipeline {
    agent any


    options {
        skipDefaultCheckout()       
        disableConcurrentBuilds()   
        buildDiscarder(logRotator(numToKeepStr: '10')) 
    }
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
                    dir('/home/dieulinh/apps/travel-tips-web') {

                        // Update repo
                        sh '''
                        git remote set-url origin https://$GIT_USERNAME:$GIT_PASSWORD@github.com/TranDieuuLinh/travel-tips-web.git
                        git fetch --all
                        git reset --hard origin/main
                        '''

                        // Frontend install & build in its own folder
                        dir('packages/frontend') {
                            sh '''
                            npm install
                            npm run build
                            '''
                        }

                        // PM2 restart/start commands
                        sh '''
                        pm2 restart frontend || PORT=3000 HOST=0.0.0.0 pm2 start npm --name frontend -- start --prefix packages/frontend
                        pm2 restart backend || pm2 start packages/backend/src/server.ts --name backend --interpreter ts-node
                        pm2 status
                        '''
                    }
                }
            }
        }
    }
}

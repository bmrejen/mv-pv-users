#!groovy

// TODO should find another way to compare master job and temporary job
String cronValue = "${JOB_NAME}".contains("Tmp") ? "" : "@midnight"
String buildToKeepRotation = "${JOB_NAME}".contains("Tmp") ? "3" : "7"

pipeline {
    options {
        timeout(time: 2, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: "${buildToKeepRotation}"))
    }
    environment {
        // default email adress of user interest by this build result
        emailAddresses = 'dev@marcovasco.fr'
    }
    triggers {
        // cron(cronValue)
        gitlab(
            triggerOnPush: false,
            triggerOnMergeRequest: false,
            triggerOnAcceptedMergeRequest: true,
            branchFilterType: "NameBasedFilter",
            targetBranchRegex: "dev",
            includeBranchesSpec: "dev",
            excludeBranchesSpec: "",
            secretToken: "cac794b8c7a303c44580c63ad77a3ac6"
        )
    }
    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'dev', description: 'Branch to build on Jenkins')
    }
    agent any
    stages {
        stage('Clone sources, configure, build, metrics, tests, versionning') {
            agent {
                dockerfile {
                    dir "docker/webserver/."
                    filename "Dockerfile"
                    args "--user root --volume /home/jenkins/.ssh:/ssh --env \"LOCAL_USER_ID=1002\" --env \"LOCAL_IP_ADDRESS=0.0.0.0\""
                    additionalBuildArgs '--pull'
                }
            }
            steps {
                script {
                    if (env.gitlabMergeRequestId) {
                        echo "Clone sources on branch ${params.gitlabSourceBranch}"
                        clone("${params.gitlabSourceBranch}")
                    } else {
                        echo "Clone sources on branch ${BRANCH_NAME}"
                        clone("${BRANCH_NAME}")
                    }
                }
                configure()
                buildProject()
                checkstyle()
                runTests()
                // versionningDist()
                displayLogs()
            }
        }
    }
    post {
        always {
            deleteDir()
            emails()
            script {
                if (isABuildToKeep()) {
                    echo "Keeping this build forever"
                    currentBuild.rawBuild.keepLog(true)
                } else {
                    echo "Not keeping this build forever"
                }
            }
        }
    }
}


def isABuildToKeep() {
    script {
        Calendar calendar = Calendar.getInstance()
        calendar.setTime(new Date())
        int currentDay = calendar.get(Calendar.DAY_OF_WEEK)
        return (currentDay == Calendar.SUNDAY && "${BRANCH_NAME}" == "dev")
    }
}

def checkstyle() {
    parallel(
        tslint: {
            // typescript lint
            sh "su - user -c 'cd ${WORKSPACE} && ./node_modules/.bin/tslint -p . -c tslint.json -t checkstyle -o ./build/tslint.xml || true'"
        },
        sasslint: {
            // sass lint
            sh "su - user -c 'cd ${WORKSPACE} && yarn run sasslint || true'"
            sh "su - user -c 'cd ${WORKSPACE} &&  sed -i \"s/^.*xml.*3\\\">\\|<\\/checkstyle>\$//g\" build/sasslint.xml'"
            sh "su - user -c 'cd ${WORKSPACE} &&  echo \"</checkstyle>\" >> build/sasslint.xml '"
            sh "su - user -c 'cd ${WORKSPACE} && echo \"<?xml version=\\\"1.0\\\" encoding=\\\"utf-8\\\"?><checkstyle version=\\\"4.3\\\">\" | cat - build/sasslint.xml  > temp && mv temp build/sasslint.xml  '"
        }
    )
}

def emails() {
    script {
        // send email to user in case of MR
        if (env.gitlabMergeRequestId) {
            echo "Send email du to merge request to ${env.gitlabUserEmail}"
            sendEmail("${env.gitlabUserEmail}")
            // send email to users in case of build failure on master branch
        } else if (params.BRANCH_NAME == 'master' && currentBuild.result == 'FAILURE') {
            echo "Send email due broken pipe and build to ${env.emailAddresses}"
            sendEmail("${env.emailAddresses}")
        }
    }
}

def buildProject() {
    parallel(
            yarn: {
                try {
                    sh "chown 1002:1004 -R ."
                    sh "su - user -c 'cd ${WORKSPACE} && yarn --ignore-optional'"
                    sh "su - user -c 'cd ${WORKSPACE} && ./node_modules/.bin/gulp dist'"
                } catch (any) {
                    currentBuild.result = 'FAILURE'
                    throw any
                }
            }
    )
}

def isJobStartedByTimer() {
    script{
        def startedByTimer = false
        try {
            def buildCauses = currentBuild.rawBuild.getCauses()
            for ( buildCause in buildCauses ) {
                if (buildCause != null) {
                    def causeDescription = buildCause.getShortDescription()
                    echo "shortDescription: ${causeDescription}"
                    if (causeDescription.contains("Started by timer")) {
                        startedByTimer = true
                    }
                }
            }
        } catch(theError) {
            echo "Error getting build cause"
        }

        return startedByTimer
    }
}

def clone(branch) {
    git url: 'git@git.passveo.com:client/poi.git', branch: branch
}

def configure() {
    sh "cp -r /ssh /home/user/.ssh && chown -R user:user /home/user/.ssh"
    sh "usermod -u 1002 user"
}

def sendEmail(emailAddress) {
    emailext(
            subject: "[JENKINS][${currentBuild.result}-'${JOB_NAME} ${BUILD_NUMBER}]'",
            from: "jenkins@planetveo.com",
            body: """<p>${currentBuild.result}: Job '${JOB_NAME} [${
                BUILD_NUMBER
            }]':</p><p>Check console output at <a href='${BUILD_URL}'>${JOB_NAME} [${
                BUILD_NUMBER
            }]</a></p>""",
            to: emailAddress
    )
}

def versionningDist() {
    sh "if git status | grep dist; then " +
        "su - user -c 'cd ${WORKSPACE} && eval \$(ssh-agent -s) && ssh-add ~/.ssh/id_rsa.git && git add dist && git commit -m \"chore(jenkins): Release - Assets \" && git push;' ; " +
    "fi"
}

def displayLogs() {
    step([$class                     : 'ViolationsPublisher',
        sunny                      : 10,
        stormy                     : 10000,
        unstable                   : 999,
        autoUpdateStormyThreshold  : true,
        autoUpdateUnstableThreshold: true,
        typePatternJson		   : '''{ "publish":[
            {"type" : "tsLint","pattern" : "build/tslint.xml" },
		    {"type" : "sassLint","pattern" : "build/sasslint.xml" }
	    ]}'''
    ])
    parallel(
        checkstyle: {
            checkstyle canComputeNew: false, canRunOnFailed: true, defaultEncoding: '', healthy: '', pattern: 'build/tslint.xml,build/sasslint.xml', unHealthy: ''
        },
        coverage: {
            step(
                [
                    $class              : 'CloverPublisher',
                    cloverReportDir     : 'coverage',
                    cloverReportFileName: 'clover.xml'
                ]
            )
            publishHTML(
                target: [
                    allowMissing         : true,
                    alwaysLinkToLastBuild: false,
                    keepAll              : true,
                    reportDir            : 'coverage/lcov-report',
                    reportFiles          : 'index.html',
                    reportName           : "Coverage Reports"
                ]
            )
        },
        junit: {
            junit keepLongStdio: true, allowEmptyResults: true, testResults: 'reports/unit.xml'
        }
    )
}

def runTests() {
    parallel(
        unitsTests: {
            script {
                try  {
                    sh "su - user -c 'cd ${WORKSPACE} && yarn run test:unit:ci' || true"
                } catch (any) {
                    currentBuild.result = 'UNSTABLE'
                }
            }
        }
    )
}

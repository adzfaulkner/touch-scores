IMAGE_TAG_JS=touch-scores_js
IMAGE_TAG_GO=touch-scores_go
IMAGE_TAG_SERVERLESS=touch-scores_serverless

js_build_docker_image:
	docker build --target js --tag ${IMAGE_TAG_JS} .

go_build_docker_image:
	docker build --target go --tag ${IMAGE_TAG_GO} .

serverless_build_docker_image:
	docker build --target serverless --tag ${IMAGE_TAG_SERVERLESS} .

js_run_command:
	docker run -v ${PWD}/frontend:/app -v /app/node_modules ${IMAGE_TAG_JS} ${cmd}

go_run_command:
	docker run -v ${PWD}/api:/go/src/app -v /go/src/app/node_modules ${IMAGE_TAG_GO} ${cmd}

serverless_run_command:
	docker run -v ${PWD}/api:/app:rw \
			-v /app/node_modules \
			-e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
			-e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
			${IMAGE_TAG_SERVERLESS} ${cmd}

js_run_unit_tests:
	make js_run_command cmd='npm run test:unit:run'

js_run_lint:
	make js_run_command cmd='npm run lint'

js_run_build:
	make js_run_command cmd='npm run build'

build_api:
	mkdir -p ${PWD}/api/bin/entrypoint
	chmod 0755 ${PWD}/api/bin/entrypoint
	docker run -v ${PWD}/api:/go/src/app:rw -w /go/src/app/cmd/entrypoint ${IMAGE_TAG_GO} sh -c 'GOARCH=arm64 GOOS=linux go build -o ../../bin/entrypoint/bootstrap'
	zip -j ${PWD}/api/bin/entrypoint/bootstrap.zip ${PWD}/api/bin/entrypoint/bootstrap

docker_build_tag_push:
	make js_build_docker_image
	make go_build_docker_image
	make serverless_build_docker_image
	docker tag ${IMAGE_TAG_JS}:latest ghcr.io/adzfaulkner/${IMAGE_TAG_JS}:latest
	docker push ghcr.io/adzfaulkner/${IMAGE_TAG_JS}:latest
	docker tag ${IMAGE_TAG_GO}:latest ghcr.io/adzfaulkner/${IMAGE_TAG_GO}:latest
	docker push ghcr.io/adzfaulkner/${IMAGE_TAG_GO}:latest
	docker tag ${IMAGE_TAG_SERVERLESS}:latest ghcr.io/adzfaulkner/${IMAGE_TAG_SERVERLESS}:latest
	docker push ghcr.io/adzfaulkner/${IMAGE_TAG_SERVERLESS}:latest

docker_pull_images:
	docker pull ghcr.io/adzfaulkner/${IMAGE_TAG_JS}:latest
	docker tag ghcr.io/adzfaulkner/${IMAGE_TAG_JS}:latest ${IMAGE_TAG_JS}:latest
	docker pull ghcr.io/adzfaulkner/${IMAGE_TAG_GO}:latest
	docker tag ghcr.io/adzfaulkner/${IMAGE_TAG_GO}:latest ${IMAGE_TAG_GO}:latest
	docker pull ghcr.io/adzfaulkner/${IMAGE_TAG_SERVERLESS}:latest
	docker tag ghcr.io/adzfaulkner/${IMAGE_TAG_SERVERLESS}:latest ${IMAGE_TAG_SERVERLESS}:latest

create_env:
	sh bin/envs.sh
	cat .env.production

deploy_api:
	make serverless_run_command cmd='serverless deploy'

deploy_fe:
	docker run -v ${PWD}/frontend:/aws -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} amazon/aws-cli s3 sync dist/ s3://${AWS_BUCKET_NAME} --region eu-west-2
	docker run -v ${PWD}/frontend:/aws -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} amazon/aws-cli cloudfront create-invalidation --distribution-id ${AWS_CF_DISTRIBUTION_ID} --paths '/*' --region eu-west-2

create_secrets:
	sh bin/create_secrets.sh
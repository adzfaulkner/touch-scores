IMAGE_TAG_JS=touch-scores_js

js_build_docker_image:
	docker build --tag ${IMAGE_TAG_JS} .

js_run_command:
	docker run -v ${PWD}:/app -v /app/node_modules ${IMAGE_TAG_JS} ${cmd}

js_run_unit_tests:
	make js_run_command cmd='npm run test:unit:run'

js_run_lint:
	make js_run_command cmd='npm run lint'

js_run_build:
	make js_run_command cmd='npm run build'

docker_build_tag_push:
	make js_build_docker_image
	docker tag ${IMAGE_TAG_JS}:latest ghcr.io/adzfaulkner/${IMAGE_TAG_JS}:latest
	docker push ghcr.io/adzfaulkner/${IMAGE_TAG_JS}:latest

docker_pull_images:
	docker pull ghcr.io/adzfaulkner/${IMAGE_TAG_JS}:latest
	docker tag ghcr.io/adzfaulkner/${IMAGE_TAG_JS}:latest ${IMAGE_TAG_JS}:latest

create_env:
	sh bin/envs.sh
	cat .env.production

deploy:
	docker run -v ${PWD}:/aws -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} amazon/aws-cli s3 sync dist/ s3://${AWS_BUCKET_NAME} --region eu-west-2
	docker run -v ${PWD}:/aws -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} amazon/aws-cli cloudfront create-invalidation --distribution-id ${AWS_CF_DISTRIBUTION_ID} --paths '/*' --region eu-west-2
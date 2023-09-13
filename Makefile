IMAGE_TAG_JS=touch-scores_js

js_build_docker_image:
	docker build --tag ${IMAGE_TAG_JS} .

js_run_command:
	docker run -v ${PWD}:/app -v /app/node_modules ${IMAGE_TAG_JS} ${cmd}

js_run_unit_tests:
	make js_run_command cmd='npm run test:unit:run'

js_run_lint:
	make js_run_command cmd='npm run lint'
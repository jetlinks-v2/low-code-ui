#!/usr/bin/env bash
docker build -t registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-low-code-ui:1.0.0-TEST .
docker push registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-low-code-ui:1.0.0-TEST

#!/bin/bash
cd public
scp -r * tencent:/var/www/web/test-webrtc
cd -
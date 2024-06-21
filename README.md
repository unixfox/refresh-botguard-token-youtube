# Docker image

https://quay.io/repository/unixfox/refresh-botguard-token-youtube

# How to use
1. Run a redis server
2. Apply two patches in invidious
- https://github.com/yewtudotbe/invidious-custom/blob/master/patches/010-use-redis-for-video-cache.patch
- https://github.com/yewtudotbe/invidious-custom/blob/master/patches/022-potoken.patch

3. Configure invidious to use redis (redis_url in config.yaml) and configure the program to use redis too using env REDIS_URL
4. Launch the program periodically.
5. Launch invidious
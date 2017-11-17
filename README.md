# My Blog

## How add to swarm

Make sure the overlay network is created

Deploy the service

```
docker service create \
	--name my-blog \
	--constraint 'node.role == worker' \
	--network internal-network \
	registry.dbogatov.org/dbogatov/my-blog:latest
```


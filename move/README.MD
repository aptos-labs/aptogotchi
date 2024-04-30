# Aptogotchi

## Publish and Upgrade Module

```shell
# publish module
./sh_scripts/move_publish.sh
```

After publishing, go to frontend directory to re-generate the ABI.

```shell
cd ../frontend
pnpm generate
```

Upgrade published module, this only works when you don't have breaking change.
If you have breaking change, you need to publish to a new address. 
```shell
./sh_scripts/move_upgrade.sh
```

## Run unit tests

```shell
./sh_scripts/move_test.sh
```

## Run Move scripts

Create gotchi.
```shell
./sh_scripts/move_run_script_create_gotchi.sh
```

Feed gotchi.
```shell
./sh_scripts/move_run_script_feed_gotchi.sh
```

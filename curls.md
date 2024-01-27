# CURLS:

## Add device
curl --request PUT \
  --url http://localhost:3000/devices \
  --header 'Content-Type: application/json' \
  --data '{
	"id" : "test",
	"brand": "Suzuki",
    "name": "Hektor",
	"createdAt": "2024-01-01T00:00:00.000Z"
}'

## Modify name
curl --request PUT \
  --url http://localhost:3000/devices/test/name/Hektor2 \
  --header 'Content-Type: application/json' 

## Modify brand
curl --request PUT \
  --url http://localhost:3000/devices/test/brand/Suzuki2 \
  --header 'Content-Type: application/json' 

## Get device
curl --request GET \
  --url http://localhost:3000/devices/test \
  --header 'Content-Type: application/json'

## Delete device
curl --request DELETE \
  --url http://localhost:3000/devices/test \
  --header 'Content-Type: application/json'

## List devices
curl --request GET \
  --url http://localhost:3000/devices \
  --header 'Content-Type: application/json'
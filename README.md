
# Heal Backend Server

This is the official backend server for Heal Mobile App


## Deployment

To run this project run :

Install packages : 
```bash
  npm install
```
Run in production mode :
```bash
  npm run start
```


## API Reference

#### Create an account

```http
  POST /user/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required** |
| `username` | `string` | **Required** |
| `password` | `string` | **Required** |

#### Login to your account

```http
  POST /user/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`| `string` | **Required**|
| `password`| `string` | **Required** |



## Authors

- [@louayyy99](https://www.github.com/louayyy99)
- [@jaouayoussef](https://www.github.com/jaouayoussef)



## Feedback

If you have any feedback, please reach out to us at heal.client.assistant@gmail.com

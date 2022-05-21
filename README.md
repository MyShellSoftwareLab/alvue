<h2 align="center">ALVue - Ajax Laravel Validator for Vue</h2>

ALVue is the update of the library that previously worked with JQuery,
this new version includes a Vue component that will help you show the errors of a Laravel FormRequest in its forms.

#### Version matrix

| Vue.js version | Package version   | Branch   |
| :---           | :---:             | ---:     | 
| 2.x            | 1.2.x             | `vue2` |
| 3.x            | 1.3.x             | `master` |

#### Installation

```shell    
npm install @myshell/alvue --save
```    

#### Import
```js
import alvue from '@myshell/alvue'
Vue.use(alvue);
```

#### Usage
```html    
<alv-form action="/example-url" method="post" @after-done="reloadPage" :data-object="user">
    <div>
        <label>Name </label>
        <input type="text" name="name" v-model="user.name">
     </div>
    ...
    <button type="submit">Save</button>
</alv-form>
```


### Properties

| Name                   | Type     | Required | Default     | Description                         |
| ---                    | ---      |   ---    | ---         | ---                                 |
| action                 | String   |  true    | undefined   | URL to post.                        |
| method                 | String   |  false   | post        | HTTP method used to send data.      |
| data-object            | Object   |  false   | undefined   | Object to send sent to server <br> If it is not included, form data is sent by input name.     |
| input-parent-selector  | String   |  false   | div         | Parent of input to append error.    |
| spinner                | Boolean  |  false   | false       | Append loading spinner.             |
| error-class            | String   |  false   | null        | Parent of input to append error class. |
| axios-config           | Object   |  false   | {}          | Axios config to create the instance. |
| html-errors            | Boolean  |  false   | false       | Support for displaying errors with html. |
| enable-button-on-done  | Boolean  |  false   | false       | Remove disabled property of submit button after success response. |


### Events

| Name        | Description              |
| ---         | ---                      |
| after-done  | Triggered after the server response is successful. <br> Contains response payload.|
| after-error | Triggered after the server response fails. <br> Contains response payload.|

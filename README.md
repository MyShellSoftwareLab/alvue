<h2 align="center">ALVue - Ajax Laravel Validator for Vue</h2>
    
ALVue is the update of the library that previously worked with JQuery, 
this new version includes a Vue component that will help you show the errors of a Laravel FormRequest in its forms.


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

| Name                   | Type       |Required | Default     | Description                        |
| ---                    | ---         | ---    | ---         | ---                                |
| action                 | String      | true   | undefined   | URL to post.                        |
| method                 | String      | false  | post        | HTTP method used to send data.      |
| data-object            | Object      | false  | undefined   | Object to send sent to server <br> If it is not included, form data is sent by input name.     |
| input-parent-selector  | String      | false  | div         | Parent of input to append error.    |
| spinner                | Boolean     | false  | false       | Append loading spinner.             |


### Events

| Name        | Description              |
| ---         | ---                      |
| after-done  | Triggered after the server response is successful. <br> Contains response payload.|
| after-error | Triggered after the server response fails. <br> Contains response payload.|

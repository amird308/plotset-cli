# Plotset

## How to use

- Install the package with `npm i -g plotset`

## Login

```
plotset login
```
## new template

```
plotset new template-name
```

with this commend ploset generated template in current directory.

the template includes the following files (in src folder).

* css(folder) 

1. Write the code css in this folder and import in src/css/main.css.
2. You automatically have access to your class inside index.html.

***

* js(folder) 

1. Write the code javascript in this folder and import in src/js/index.js.
2. You must have this methods which we will discuss in the following.

method | when run this method in base plotset? | required 
--- | --- | ---
init_handler | `first time` `change data` `change col rel(bindings)` | true
transformData | `first time`  `change data` `change col rel(binding)` | false
change_config_handler | `change config(setting)` | true
resizeHandler | `resize iframe` | true

***

* index.html

1. Inside this file you can write html code and add external modules.
2. Be sure to add module https://plotset.com/charts/js/base-cafedata/v1.0.0.js.

***

* bindings.json

⋅⋅⋅  ⋅⋅

***

* data.csv

default data template.

***

* info.json

you must enter the name and category of the template in this file.

***

* settings.json

1. this file puts your template settings and inputs into poltset.com and allows you to change the settings.
2. you must also enter the default value of the template settings in this file.

***

* thumbnail.png

this is a preview of your template image on plotset.com.

***

## publish
```
plotset publish
```
enter `template id` if you want update your template or enter `new` if you have new template.

note: if exist templateId field in directoryTemplate/plotset.json

like this 

```
{
    "templateId": 102
}
```







## API Global Methods and Variable

### data
### backupData
### config
### oldConfig
### col_rel
### width
### height
### init_handler
### change_config_handler
### transformData
### resizeHandler

## lifecycle events
#### first time
![alt text](https://raw.githubusercontent.com/amird308/plotset-cli/main/first_time.png "first time")

#### change data
![alt text](https://raw.githubusercontent.com/amird308/plotset-cli/main/change_data.png "change data")

#### change col rel
![alt text](https://raw.githubusercontent.com/amird308/plotset-cli/main/change_col_rel.png "change col rel")

#### change config
![alt text](https://raw.githubusercontent.com/amird308/plotset-cli/main/change_config.png "change config")

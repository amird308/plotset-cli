# Plotset

## How to use

- Install the package with `npm i -g plotset`

## Login

```
plotset login
```
## new project

```
plotset new project-name
```

whit this commend ploset generated template in current root.

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

default data chart.

***

* info.json

you must enter the name and category of the chart in this file.

***

* settings.json

1. this file puts your chart settings and inputs into poltset.com and allows you to change the settings.
2. you must also enter the default value of the chart settings in this file.

***

* thumbnail.png

this is a preview of your chart image on plotset.com.

***

## publish
```
plotset publish
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
# Plotset

## How to use

- Install the package with `npm i -g plotset`

## Login

```
plotset login
```
## create project

```
plotset create project-name
```

whit this commend ploset created template in this current path.

the template includes the following files (in src folder).

* css(folder) 

1. Write the code css in this folder and import in src/css/main.css.
2. You automatically have access to your class inside index.html.

***

* js(folder) 

1. Write the code javascript in this folder and import in src/js/index.js.
2. You must have this methods which we will discuss in the following.

... init_handler 
... transformData
... change_config_handler
... resizeHandler

***

* index.html

1. Inside this file you can write html code and add external modules.
2. Be sure to add module https://plotset.com/charts/js/base-cafedata/v1.0.0.js.

***

* bindings.json

...

***

* data.csv

...Sample default data chart for user guide.

***

* info.json

...You must enter the name and category of the chart in this file.

***

* settings.json

1. This file puts your chart settings and inputs into poltset.com and allows you to change the settings.
2. You must also enter the default value of the chart settings in this file.

***

* thumbnail.png

... This is a preview of your chart image on plotset.com.

***

## deploy
```
plotset deploy

```
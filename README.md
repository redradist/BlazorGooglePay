<a href="https://www.buymeacoffee.com/redradist" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

# BlazorGooglePay

This library is wrapper around GooglePay Js library that provides
`BlazorGooglePayButton` razor component as well as direct access to GooglePay API
and embedding `GooglePayButton` in custom Blazor component

To use this package you have to update your `index.html` like in the following example:
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Awesome BlazorGooglePay Application</title>
    <base href="/" />
    <link href="css/normalize.css" rel="stylesheet" />
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet" />
    <link href="css/app.css" rel="stylesheet" />
</head>

<body>
    <app>Loading...</app>

    <div id="blazor-error-ui">
        An unhandled error has occurred.
        <a href="" class="reload">Reload</a>
        <a class="dismiss">🗙</a>
    </div>
    <script src="_framework/blazor.webassembly.js" autostart='false'></script>
    <script src="https://cdn.jsdelivr.net/gh/redradist/Blazor.Dependecies/src/blazor.dependencies.js"></script>
    <script>
        window.blazorDepsPromise.then(() => {
            Blazor.start();
        });
    </script>
</body>

</html>
```
The most important part in this `html` is that:
```html
    ...
    <script src="_framework/blazor.webassembly.js" autostart='false'></script>
    <script src="https://cdn.jsdelivr.net/gh/redradist/Blazor.Dependecies/src/blazor.dependencies.js"></script>
    <script>
        window.blazorDepsPromise.then(() => {
            Blazor.start();
        });
    </script>
    ...
```
Also you have to add in `wwwroot` directory the following file `blazorDeps.json`:
```json
[
  {
    "type": "Razor Class Library",
    "name": "BlazorGooglePay"
  },
]
```
All this changes done [`BlazorDependecies`](https://github.com/redradist/BlazorDependencies) Blazor static files manager

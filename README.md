# ratingBox.js
A jQuery plugin that uses Font Awesome to display rating boxes in your page

# setup

    <html>
        <head>
            <link rel="stylesheet" href="font-awesome-4.7.0/css/font-awesome.css" />
            <link rel="stylesheet" href="ratingbox.css" />
        </head>
        <body>

            <!-- PAGE BOTTOM -->
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
            <script src="ratingbox.js"></script>
        </body>
    </html>

ratingbox.css file is not a mandatory. Use it to customize your rating boxes

# use

    <div id="rating1" class="ratingbox"></div>
    <script>
        $('#rating1').ratingBox({
            value: 2
        });
    </script>

# Examples
See index.htm for more examples

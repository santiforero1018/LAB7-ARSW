appModule = (function () {
    let author = '';

    let name = '';

    const api = true;

    let currentApi = api ? apiclient : apimock;

    let nextPoint = [];

    let newPoints = [];

    let can = false;

    function setAuthorName() {
        author = $('#theInput').val();
    }

    function getAuthorName() {
        return author;
    }


    function addNewPoint() {
        newPoints.push({ "x": parseInt($('.nuevo').eq(1).val()), "y": parseInt($('.nuevo').eq(2).val()) });

        // alert('Punto añadido al BluePrint, Recuerda al final salvar el BluePrint');
        $('.nuevo').eq(1).val('');
        $('.nuevo').eq(2).val('');
    }

    function hide() {
        $('.table-borderless').toggleClass('invisible');
    }



    function getBluePrints() {
        can = false;
        $('#addB').prop('disabled', false);
        $('.upt').prop('disabled', true);
        newPoints = [];
        var canvas = document.getElementById("paint");
        var c = canvas.getContext("2d");
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.beginPath();
        currentApi.getBlueprintsByAuthor(author, function (data) {
            const bluePrints = data.map(function (bp) {
                return { name: bp.name, points: bp.points.length };
            });


            $('.table').eq(0).find('td').remove();


            var i = 0;
            bluePrints.map(function (info) {
                const newRow = $('<tr>');
                newRow.append('<td class="bpname">' + info.name + '</td>');
                newRow.append('<td>' + info.points + '</td>');
                newRow.append('<td><button class="draw" onclick="appModule.getABluePrint(' + i + ')">Show</button></td>');
                $('.table').eq(0).append(newRow);
                i++;
            });


            const totalPoints = data.reduce((acc, bluePrint) => acc + bluePrint.points.length, 0);
            $('#total').text(totalPoints);

        });


    }

    function getABluePrint(index) {
        can = true;
        $('.upt').prop('disabled', false);
        const bpname = $('td.bpname').eq(index).text();

        currentApi.getBlueprintsByNameAndAuthor(author, bpname, function (data) {
            var bluePrint = data;

            $('#selected').text(bpname);
            name = bpname;
            console.log(name);
            var canvas = document.getElementById("paint");

            var c = canvas.getContext("2d");
            c.clearRect(0, 0, canvas.width, canvas.height);
            c.beginPath();
            c.strokeStyle = "red";
            c.lineWidth = 5;
            bluePrint.points.forEach(function (point, index) {
                if (index === 0) {
                    c.moveTo(point.x, point.y);
                } else {
                    c.lineTo(point.x, point.y);
                    nextPoint[0] = point.x;
                    nextPoint[1] = point.y
                }
            });
            c.stroke();
        });
    }



    function draw(event) {
        var canvas = document.getElementById("paint");
        var offset = getOffset(canvas);
        //var datadiv = document.getElementById('datadiv');
        //datadiv.innerHTML = 'offsetLeft: ' + offset.left + ', offsetTop: ' + offset.top;
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            if (can) {
                ctx.moveTo(nextPoint[0], nextPoint[1]);
                ctx.lineTo(event.pageX - offset.left, event.pageY - offset.top);
                newPoints.push({ "x": event.pageX - offset.left, "y": event.pageY - offset.top });
                ctx.stroke();
                nextPoint[0] = event.pageX - offset.left;
                nextPoint[1] = event.pageY - offset.top;

            }
            else {
                ctx.fillStyle = 'red';
                ctx.fillRect(event.pageX - offset.left, event.pageY - offset.top, 5, 5);
            }
            ctx.stroke();
        }
    }


    function putBluePrint() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/API-V1.0Blueprints/" + author + "/" + name,
                type: 'PUT',
                data: JSON.stringify({ "author": author, "points": newPoints, "name": name }),
                contentType: "application/json",
                success: function (dataa) {
                    newPoints = [];
                    getBluePrints();
                    $('#selected').text("");
                    resolve(dataa);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    }

    function newBluePrint() {
        var canvas = document.getElementById("paint");
        var c = canvas.getContext("2d");
        c.clearRect(0, 0, canvas.width, canvas.height);
        name = $('.nuevo').eq(0).val();
        console.log("Nombre del plano: " + name);
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/API-V1.0Blueprints/blueprints",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ "author": author, "points": newPoints, "name": name }),
                success: function (data) {
                    newPoints = [];
                    getBluePrints();
                    name = '';
                    $('.nuevo').eq(0).val('');
                    hide();
                    resolve(data);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    }

    function deleteBlueprint() {
        var canvas = document.getElementById("paint");
        var c = canvas.getContext("2d");
        c.clearRect(0, 0, canvas.width, canvas.height);
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/API-V1.0Blueprints/" + author + "/" + name,
                type: "DELETE",
                success: function (data) {
                    newPoints = [];
                    getBluePrints();
                    name = '';
                    $('#selected').text("");
                    resolve(data);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    }


    //  function drawMouse(event) {

    //   var canvas = document.getElementById('mycanvas');
    //    var offset  = getOffset(canvas);
    //    var datadiv = document.getElementById('datadiv');

    //    if (canvas.getContext) {
    //      var ctx = canvas.getContext("2d");

    //   ctx.fillStyle = '#ff0000';
    //   ctx.fillRect(event.pageX-offset.left, event.pageY-offset.top, 5, 5);

    //  }
    // } 


    function getOffset(obj) {
        var offsetLeft = 0;
        var offsetTop = 0;
        do {
            if (!isNaN(obj.offsetLeft)) {
                offsetLeft += obj.offsetLeft;
            }
            if (!isNaN(obj.offsetTop)) {
                offsetTop += obj.offsetTop;
            }
        } while (obj = obj.offsetParent);
        return { left: offsetLeft, top: offsetTop };
    }

    return {
        setAuthorName,
        getAuthorName,
        addNewPoint,
        hide,
        getBluePrints,
        getABluePrint,
        putBluePrint,
        newBluePrint,
        deleteBlueprint,
        initPointerCanvas: function () {
            $(document).ready(function () {
                // Detecta cambios en el input "theInput"
                $('#theInput').on('input', function () {
                    var author = $(this).val();
                    var getButton = $('#get');

                    // Habilita o inhabilita el botón en función del contenido del input
                    if (author.trim() !== '') {
                        getButton.prop('disabled', false); // Habilita el botón
                    } else {
                        getButton.prop('disabled', true); // Inhabilita el botón
                    }
                });

                // También verifica el estado del input al cargar la página
                $('#theInput').trigger('input');
            });
            var canvas = document.getElementById("paint");
            if (window.PointerEvent) {
                canvas.addEventListener("pointerdown", draw, false);
            }
            else canvas.addEventListener("mousedown", draw, false);
        }
    }


})();
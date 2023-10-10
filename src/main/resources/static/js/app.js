appModule = (function () {
    let author = '';

    const api = true;

    let currentApi = api ? apiclient:apimock;
    
    function setAuthorName() {
        author = $('#theInput').val();
    }

    function getAuthorName() {
        return author;
    }

    function getBluePrints(){
        currentApi.getBlueprintsByAuthor(author, function(data){
            const bluePrints = data.map(function(bp){
                return {name: bp.name, points: bp.points.length};
            });
            
            
            
            $('.table').find('td').remove();
            
            
            var i = 0;
            bluePrints.map(function (info) {
                const newRow = $('<tr>');
                newRow.append('<td class="bpname">' + info.name + '</td>');
                newRow.append('<td>' + info.points + '</td>');
                newRow.append('<td><button class="draw" onclick="appModule.getABluePrint('+i+')">Show</button></td>');
                $('.table').append(newRow);
                i++;
            });

            
            const totalPoints = data.reduce((acc, bluePrint) => acc + bluePrint.points.length, 0);
            $('#total').text(totalPoints);
        });
    }

    function getABluePrint(index){
        
        const bpname = $('td.bpname').eq(index).text();
        
        currentApi.getBlueprintsByNameAndAuthor(author, bpname, function(data){
            var bluePrint = data;
            
            $('#selected').text(bpname);
            var canvas = document.getElementById("paint");
          
            var c = canvas.getContext("2d");
            c.clearRect(0, 0, canvas.width, canvas.height);
            c.beginPath();
            c.strokeStyle = "red";
            c.lineWidth = 5;
            bluePrint.points.forEach(function (point, index) {
                if (index === 0) {
                    c.moveTo(point.x,point.y);
                    
                } else {
                    c.lineTo(point.x, point.y);
                    
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
            ctx.fillStyle = 'red';
            ctx.fillRect(event.pageX - offset.left, event.pageY - offset.top, 6, 6);
        }
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
        getBluePrints,
        getABluePrint,
        initPointerCanvas:function() {
            var canvas = document.getElementById("paint");
            if (window.PointerEvent) {
                canvas.addEventListener("pointerdown", draw, false);
            }
            else canvas.addEventListener("mousedown", draw, false);
    
        }
    }


})();
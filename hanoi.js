
function hanoiSequence(numberDisks , origin , helper , target) {
    if (numberDisks == 0) {
        return [];
    }
    else{
        return[
            ...hanoiSequence(numberDisks - 1, origin , target , helper),
            [origin , target],
            ...hanoiSequence(numberDisks - 1 , helper , origin , target)
        ];
    }
}

let diskNumber = 3;
let pegs;
let delay = 1000;
let pegOrder = [0,1,2];
let paused;
let nextIndex;

function init() {
    paused = false;
    nextIndex = 0;
    pegs = [[],[],[]];
    $("#numberInput").val(diskNumber);
    $("#delayInput").val(delay);
    $(".disk").remove();
    $("#game").css("--disk-number" , diskNumber);
    for (let i = diskNumber; i >= 1; i--){
        pegs[0].push(i);  
        $("<div></div>").addClass("disk")
        .css("transition-duration" , `${Math.round(delay/4.5)}ms`)
        .attr("id",i)
        .css("--size" , i)
        .css("--x" , 0)
        .css("--y" , diskNumber - i + 1)
        .appendTo("#game");
    }
}

init();

$("#startBtn").click(async () => {
    paused = false;
    $("#pauseBtn").prop("disabled" , false);
    $("#startBtn , #numberInput").prop("disabled" , true);
    const sequence = hanoiSequence(diskNumber , ...pegOrder);
    console.log(sequence);
    for (let i = nextIndex; i < sequence.length ; i++) {
        const [source , target] = sequence[i];
        await performMove(source , target);
        nextIndex = i+1;
        if (paused) break;
    }
    $("#pauseBtn").prop("disabled" , true);
    $("#startBtn , #numberInput").prop("disabled" , false);
    if (nextIndex == sequence.length) {
        pegOrder.reverse();
        nextIndex = 0;
    }
});

$("#pauseBtn").click(() => paused = true);


async function performMove(source , target) {
    const diskId = pegs[source].pop();
    pegs[target].push(diskId);
    const disk = $(`#${diskId}`);
    disk.css("--y" , 12)
    await sleep(delay / 3);
    disk.css("--x" , target);
    await sleep(delay / 3);
    disk.css("--y" , pegs[target].length);
    await sleep(delay / 3);
}

$("#numberInput").change(function () {
    diskNumber = parseInt($(this).val());
    init();
});

$("#delayInput").change(function () {
    delay = parseInt($(this).val());
    $(".disk").css(
        "transition-duration",
        `${Math.round(delay/4.5)}ms`
    );
});

async function sleep(time) {
    return new Promise((res) => setTimeout(res,time));
}
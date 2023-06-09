import { initializeApp} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getDatabase, ref, set, get, onValue, child, update, push} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyAOyb4dGal_zFL3l2F2goDMWB8YHtftHIU",
    authDomain: "cb-character-db.firebaseapp.com",
    databaseURL: "https://cb-character-db-default-rtdb.firebaseio.com",
    projectId: "cb-character-db",
    storageBucket: "cb-character-db.appspot.com",
    messagingSenderId: "591041214038",
    appId: "1:591041214038:web:a73e2d6600000768222df7",
    measurementId: "G-H3MEWE7E54"
  };

$(document).ready(function() {
    init();
});

// function initMap() {
//     var newLat = $("#newPinLat").val();
//     var newLang = $("#newPinLang").val();
//     var pinTtl = $("#newPnTtl").val();
//     const myLatLng = { lat: 41.701040, lng: -72.320160 };
//     var newPin = { lat: parseFloat(newLat), lng: parseFloat(newLang) };
    
//     var map = new google.maps.Map(document.getElementById('map'), {
//       center: {lat: 41.701040, lng: -72.320160},
//       zoom: 8
//     });
//     new google.maps.Marker({
//         position: myLatLng,
//         map,
//         title: "Australia",
//       });

//     if(newLat !== "" || newLang !=="") {
//     new google.maps.Marker({
//         position: newPin,
//         map,
//         title: pinTtl,
//       });
//     }
//   }

const init = () => {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    //Map Test
    function setMapStart (lat, lng) {
        set(ref(db,'/map/start'),{
            'lat': lat,
            'long': lng
        });
    }

    var startMap;

    $("#newPinBtn").on('click',function(){
        initMap();
      });

      //initMap();

    // function initMap() {
    //     var newLat = $("#newPinLat").val();
    //     var newLang = $("#newPinLang").val();
    //     var pinTtl = $("#newPnTtl").val();
    //     const myLatLng = { lat: 41.701040, lng: -72.320160 };
    //     var newPin = { lat: parseFloat(newLat), lng: parseFloat(newLang) };
        
    //     var map = new google.maps.Map(document.getElementById('map'), {
    //       center: {lat: 41.701040, lng: -72.320160},
    //       zoom: 8
    //     });
    //     new google.maps.Marker({
    //         position: myLatLng,
    //         map,
    //         title: "Australia",
    //       });

    //     if(newLat !== "" || newLang !=="") {
    //     new google.maps.Marker({
    //         position: newPin,
    //         map,
    //         title: pinTtl,
    //       });
    //     }
    //   }
      
    function getMapStart () {
        get(ref(db,'/map/start')).then((snapshot) => {
            if(snapshot.exists()) {
                
                var start = snapshot.val();
                console.log(start);
                startMap = [start.lat, start.long];
                
            }
            else {
                setMapStart (41.701040, -72.320160);
            }
            
        });
    }

    //getMapStart();  

     //Roll Stats

    const rollDie = (sides, count, reroll, type, stat=false) => {
        var rolls = [];
        var roll;
        var total = 0;
        for (let i=0; i<count; i++) {
            roll = Math.floor(Math.random() * sides) + 1;
            while (roll < reroll) {
                console.log("Rerolling Die #"+i+" for " + type);
                roll = Math.floor(Math.random() * sides) + 1;
            }
            rolls.push(roll);
        }
        if (stat) {
            rolls.sort((a,b)=>b-a);
            for (let k=0; k<rolls.length-1; k++) {
                total += rolls[k];
            }
        }
        else {
            for (let k=0; k<rolls.length; k++) {
                total += rolls[k];
            }
        }
        rolls.push(total);
        console.log(rolls);
        return rolls;
    }

    $("#rollStats").on('click', function() {
        rollStats();
    });

    const rollStats = () => {
        var rolls = [];
        var boxes = $("#statList .card-body").toArray();
        var boxHeads = $("#statList .card-title").toArray();
        for (let i=0; i<6; i++) {
            let roll = rollDie(6, 4, 2, "attr", true);
            rolls.push(roll);
        }
        console.log(rolls);
        for (let j=0; j<rolls.length; j++) {
            var box = boxes[j];
            var boxHd = boxHeads[j];
            console.log(box);
            var rollOutcome = "";
            var rollTotal = rolls[j][rolls[j].length-1];
            for (let g=0; g<rolls[j].length-1; g++) {
                rollOutcome += rolls[j][g] + ",";
            }
            boxHd.innerHTML = rollTotal;
            box.innerHTML = rollOutcome;
        }       
    }
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });

    

    //Key Press

    $("#startKeyCheck").on('click',function() {
        $(document).keydown(function (event) {
            var keyLog = $("<p></p>");
            keyLog.html('You pressed the' + event.which +' key')
            $("#app3").append(keyLog);
            //alert('You pressed the' + event.which +' key');
        });
    });

    $("#stopKeyCheck").on('click', function(){
        $(document).off('keydown');
    });

    //CSV to JSON
    function csvToJson(csv, numHds) {
        var adjCSV;
        
        var csvSplit = csv.split(",");
        var headers = [];
        var json = "[";
        var rows;
        for(let i=0; i<numHds; i++){
            headers.push(csvSplit[i]);
        }
        rows = csvSplit.length/headers.length;
        console.log(rows);
        for(let j=0; j<rows-1; j++){
            json += "{";
            var jsonBit;
            for(let k=0; k<headers.length; k++) {
                var x = j+1; var z = x*headers.length; var bkMk = z+k;
                jsonBit = headers[k]+": "+csvSplit[bkMk]+",";
                console.log(jsonBit);
                json += jsonBit;
            }

            json += "},";
        }
        json += "]";
        return json;
    }

    $("#checkConvert").on('click', function(){
        console.log("convert clicked");
        var csv = $("#csv").val();
        var hds = $("#hds").val();
        console.log(hds);
        var json = csvToJson(csv, hds);
        console.log(json);
    });

    $('.btn-success').on('click',function(){
        $(this).toggleClass('btn-outline-success');
        $(this).toggleClass('btn-success');
    });

    //Interactive Grid

    $('#newGrid').on('click',function(){
        newRow($('#grid'),'h-50 ','row1');
        $(this).hide();
    });

    $('.addCol').on('click',function(){
        console.log('New Column Added');
        newCol($(this).parent);
        //$(this).hide();
    });

    $('.addRow').on('click',function(){
        console.log('New Row Added');
        newRow($(this).parent);
        //$(this).hide();
    });

    //$('.gridCol').append($("<button class=\" addRow btn btn-secondary\" >+</>"));

    //$('.gridRow').append($("<button class=\" addCol btn btn-secondary\" >+</>"));

    function newRow (parent,clss,id) {
        var row = $('<div class=\" row gridRow border border-primary\" >  </div>'); row.attr('id', id);
        var col = $('<div class=\" position-relative col gridCol border border-primary\"></div>');
        
        var newColBtn = $("<button class=\" position-absolute top-0 start-100 w-auto  badge rounded-pill addCol btn btn-secondary\" >+</>");
        row.append(newColBtn);
        row.addClass(clss);

        $(parent).append(row);
    }

    function newCol (parent,clss) {
        var col = $('<div class=\"col gridCol border border-primary\" > </div>'); col.attr('id', id);
        var newRowBtn =$("<button class=\"  top-0 start-100 w-auto badge rounded-pill addRow btn btn-secondary\" >+</>")
        col.append(newRowBtn);
        col.addClass(clss);

        $(parent).append(col);
    }

    $('#loadQR').on('click',function(){
        var qrData = $('#qrCodeData').val();
        generateQRCode(qrData, 'qrcode');
    });

    function generateQRCode(data, containerId) {
        var container = document.getElementById(containerId);
        container.innerHTML = ""; // Clear any existing content
        var wide, high;
        console.log(data);

        var qrcode = new QRCode(container, {
          text: data,
          width: 128,
          height: 128,
        });
      }
      

    //Summernote

    $('.airmode').summernote({
        airMode:true,
        popover:{
          air:[
            ['style', ['style']],
            ['style',['bold','italic','underline','clear']],
            ['fontsize',['fontsize']],
            ['para',['ul', 'ol']]
          ]
        }
      });
    
    $('.summernote').summernote();

    //Bingo Board

    $("#loadBingoBoard").on('click',function(){
        loadBingo();
        $("#bingoGrid").toggleClass('d-none');
    });

    function loadBingo () {
        var ins = [];
        var cells = [1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19,20,21,22,23,24,25],
            rands = [],
            x = cells.length,
            y = 0;
        while (x--) {
            y = Math.floor(Math.random() * (x+1)); rands.push(cells[y]);  cells.splice(y,1);      }
        //console.log(rands);
        $(".bingoIn").each(function(){
            ins.push($(this).val());
        });    
        //console.log(ins);
        for(let i=0; i<rands.length; i++){
            $(".bingoCol").eq(rands[i]-1).text(ins[i]);
        }

        $("#middleStar").html("&#9733");
            

    }
    
    var ExcelToJSON = function() {

        this.parseExcel = function(file) {
          var reader = new FileReader();
    
          reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
              type: 'binary'
            });
            workbook.SheetNames.forEach(function(sheetName) {
              // Here is your object
              var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
              console.log(XL_row_object);
              var ul = $('<ul></ul>');
              var list = XL_row_object;
                for (let i=0; i<list.length; i++) {
                    var li = $('<li></li>');
                    ul.append(li);
                    var ulSmall = $('<ul></ul>'); li.append(ulSmall);
                    var obj = list[i];
                    for (var key in obj) {
                        var val = obj[key];
                        var item = $('<li></li>'); 
                        item.html(key +": "+ val);
                        ulSmall.append(item);
                    }
                    
                }
              $('#jsonToExcelP').append(ul);
              var json_object = JSON.stringify(XL_row_object);
              console.log(JSON.parse(json_object));
              $('#jsonToExcel').val(json_object);
            })
          };
    
          reader.onerror = function(ex) {
            console.log(ex);
          };
    
          reader.readAsBinaryString(file);
        };
      };
    function handleFileSelect(evt) {
    
        var files = evt.target.files; // FileList object
        var xl2json = new ExcelToJSON();
        xl2json.parseExcel(files[0]);
      }


    //MAP
    // let map;

    //     async function initMap() {
    //     const { Map } = await google.maps.importLibrary("maps");
    //     map = new Map(document.getElementById("map"), {
    //         center: { lat: -34.397, lng: 150.644 },
    //         zoom: 8,
    //     });
    //     }

    // initMap();
    
    document.getElementById('jsonTest').addEventListener('change', handleFileSelect, false);

    //Spells

    $("#uploadSpells").on('click',function() {
        spellList("upload");
    } );

    $("#showSpells").on('click', function() {
        spellList("show")
    });
    function spellList (action) {
        switch (action) {
            case "upload": 
                set(ref(db,'/spells'),allSpells);
                alert("Spells uploaded");
                break;
            case "show":
                var toFill = $('#empty');
                get(ref(db,'/spells')).then((snapshot) => {
                    if(snapshot.exists()) {
                        //console.log(snapshot.val());
                        var spells = snapshot.val();
                        for (let i=0; i<spells.length; i++) {
                            var spellName = spells[i].name.replace(' ', '-');
                            var spellName = spellName.replace('\'','');
                            var spellName = spellName.replace('\/','');
                            var spellUL = $("<li class=\"list-group-item\" > </li>"); spellUL.attr('id', spellName+"-row"); 
                            var spellShow =  $("<a class=\"btn btn-success\" > </a>"); spellShow.attr('data-bs-target', '#'+spellName+'-Collapse'); spellShow.attr('data-bs-toggle','collapse');
                            spellShow.text(spells[i].name);
                            spellUL.append(spellShow);
                            $("#spellList").append(spellUL);
                            var spellLvlBdg = $("<span class=\"badge bg-primary rounded-pill top-0 start-100\"></span>"); spellLvlBdg.attr('id', spellName+"-LvlBdg"); spellLvlBdg.text(spells[i].level);
                            spellUL.append(spellLvlBdg);
                            var spellCollapse = $("<div class=\" collapse \"> </div>"); spellCollapse.attr('id', spellName+"-Collapse"); 
                            spellUL.append(spellCollapse);
                            var spellCard = $("<div class=\"card card-body spellCard\" > </div>"); spellCard.attr('id', spellName+'-Card');
                            spellCollapse.append(spellCard);
                            var spellCardList = $("<ul class=\"list-group list-group-flush\"> </ul>");
                            spellCard.append(spellCardList);
                            var spellLI1 = $("<li class=\"list-group-item\"></li>"); spellCardList.append(spellLI1);
                            var spellHL1 = $("<ul class=\"list-group list-group-horizontal\"> </ul>"); spellHL1.attr('id', spellName+'-HL1');
                            spellLI1.append(spellHL1);
                            var spellAction = $("<li class=\"list-group-item\" </li>"); spellAction.attr('id', spellName+'-Action');
                            var spellDuration = $("<li class=\"list-group-item\" </li>"); spellDuration.attr('id', spellName+'-Duration');
                            var spellRange = $("<li class=\"list-group-item\" </li>"); spellRange.attr('id', spellName+'-Range');
                            spellHL1.append(spellAction, spellDuration, spellRange);
                            var spellLI2 = $("<li class=\"list-group-item\"></li>"); spellCardList.append(spellLI2);
                            var spellHL2 = $("<ul class=\"list-group list-group-horizontal\"> </ul>"); spellHL2.attr('id', spellName+'-HL2');
                            spellLI2.append(spellHL2);
                            var spellClass = $("<li class=\"list-group-item\" </li>"); spellClass.attr('id', spellName+'-Class');
                            var spellSchool = $("<li class=\"list-group-item\" </li>"); spellSchool.attr('id', spellName+'-School');
                            spellHL2.append(spellClass, spellSchool);
                            var spellLI3 = $("<li class=\"list-group-item\"></li>"); spellCardList.append(spellLI3); spellLI3.attr('id', spellName+'-Desc');
                            spellCardList.append(spellLI3);
                            spellLI3.text(spells[i].description); spellAction.text(spells[i].casting_time); spellDuration.text(spells[i].duration); 
                            spellRange.text(spells[i].range);  spellSchool.text(spells[i].school);
                            var classes = "";
                            for (let j=0; j<spells[i].classes; j++) {
                                classes += spells[i].classes[j]+", ";
                            }
                            spellClass.text(classes);
                            var components = ""; 
                            for (let k=0; k<spells[i].components; k++) {
                                components += spells[i].components[k]+", ";
                            }
                            //console.log(components);
                        }
                    }
                });
                break;
            default:
                console.log("No actions for spellList");
        }
        
    
    }

    var allSpells = [
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You hurl a bubble of acid. Choose one creature within range, or choose two creatures within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage.\n\nThis spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Acid Splash",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "sorcerer",
                "wizard",
                "cantrip"
            ],
            "type": "Conjuration cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "ranger",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a tiny bell and a piece of fine silver wire"
                ],
                "raw": "V, S, M (a tiny bell and a piece of fine silver wire)",
                "somatic": true,
                "verbal": true
            },
            "description": "You set an alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube. Until the spell ends, an alarm alerts you whenever a Tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures that won't set off the alarm. You also choose whether the alarm is mental or audible.\n\nA mental alarm alerts you with a ping in your mind if you are within 1 mile of the warded area. This ping awakens you if you are sleeping.\n\nAn audible alarm produces the sound of a hand bell for 10 seconds within 60 feet.",
            "duration": "8 hours",
            "level": "1",
            "name": "Alarm",
            "range": "30 feet",
            "ritual": true,
            "school": "abjuration",
            "tags": [
                "ranger",
                "wizard",
                "level1"
            ],
            "type": "1st-level abjuration (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a morsel of food"
                ],
                "raw": "V, S, M (a morsel of food)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. It must see and hear you. If the beast's Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell's duration. If you or one of your companions harms the target, the spell ends.",
            "duration": "24 hours",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional beast for each slot level above 1st.",
            "level": "1",
            "name": "Animal Friendship",
            "range": "30 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "druid",
                "ranger",
                "level1"
            ],
            "type": "1st-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a drop of blood"
                ],
                "raw": "V, S, M (a drop of blood)",
                "somatic": true,
                "verbal": true
            },
            "description": "Up to three creatures of your choice that you can see within range must make Charisma saving throws. Whenever a target that fails this saving throw makes an attack roll or a saving throw before the spell ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.",
            "level": "1",
            "name": "Bane",
            "range": "30 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "cleric",
                "level1"
            ],
            "type": "1st-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You extend your hand and trace a sigil of warding in the air. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks.",
            "duration": "1 round",
            "level": "cantrip",
            "name": "Blade Ward",
            "range": "Self",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "cantrip"
            ],
            "type": "Abjuration cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "paladin"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a sprinkling of holy water"
                ],
                "raw": "V, S, M (a sprinkling of holy water)",
                "somatic": true,
                "verbal": true
            },
            "description": "You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.",
            "level": "1",
            "name": "Bless",
            "range": "30 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "cleric",
                "paladin",
                "level1"
            ],
            "type": "1st-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much damage on a successful one.\n\nThe fire ignites any flammable objects in the area that aren\u2019t being worn or carried.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
            "level": "1",
            "name": "Burning Hands",
            "range": "Self (15-foot cone)",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it. The charmed creature regards you as a friendly acquaintance. When the spell ends, the creature knows it was charmed by you.",
            "duration": "1 hour",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.",
            "level": "1",
            "name": "Charm Person",
            "range": "30 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "druid",
                "sorcerer",
                "warlock",
                "wizard",
                "level1"
            ],
            "type": "1st-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a ghostly, skeletal hand in the space of a creature within range. Make a ranged spell attack against the creature to assail it with the chill of the grave. On a hit, the target takes 1d8 necrotic damage, and it can't regain hit points until the start of your next turn. Until then, the hand clings to the target.\n\nIf you hit an undead target, it also has disadvantage on attack rolls against you until the end of your next turn.\n\nThis spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
            "duration": "1 round",
            "level": "cantrip",
            "name": "Chill Touch",
            "range": "120 feet",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "sorcerer",
                "warlock",
                "wizard",
                "cantrip"
            ],
            "type": "Necromancy cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a diamond worth at least 50gp"
                ],
                "raw": "V, S, M (a diamond worth at least 50gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "You hurl a 4-inch-diameter sphere of energy at a creature that you can see within range. You choose acid, cold, fire, lightning, poison, or thunder for the type of orb you create, and then make a ranged spell attack against the target. If the attack hits, the creature takes 3d8 of the type you chose.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.",
            "level": "1",
            "name": "Chromatic Orb",
            "range": "90 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of powder or sand that is colored red, yellow, and blue"
                ],
                "raw": "V, S, M (a pinch of powder or sand that is colored red, yellow, and blue)",
                "somatic": true,
                "verbal": true
            },
            "description": "A dazzling array of flashing, colored light springs from your hand. Roll 6d10; the total is how many hit points of creatures this spell can effect. Creatures in a 15-foot cone originating from you are affected in ascending order of their current hit points (ignoring unconscious creatures and creatures that can't see).\n\nStarting with the creature that has the lowest current hit points, each creature affected by this spell is blinded until the spell ends. Subtract each creature's hit points from the total before moving on to the creature with the next lowest hit points. A creature's hit points must be equal to or less than the remaining total for that creature to be affected.",
            "duration": "1 round",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, roll an additional 2d10 for each slot level above 1st.",
            "level": "1",
            "name": "Color Spray",
            "range": "Self (15-foot cone)",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level illusion"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn\u2019t understand your language, or if your command is directly harmful to it.\n\nSome typical commands and their effects follow. You might issue a command other than one described here. If you do so, the DM determines how the target behaves. If the target can\u2019t follow your command, the spell ends.\n\nApproach: The target moves toward you by the shortest and most direct route, Ending its turn if it moves within 5 feet of you.\nDrop: The target drops whatever it is holding and then ends its turn.\nFlee: The target spends its turn moving away from you by the fastest available means.\nGrovel: The target falls prone and then ends its turn.\nHalt: The target doesn't move and takes no Actions. A flying creature stays aloft, provided that it is able to do so. If it must move to stay aloft, it flies the minimum distance needed to remain in the air.",
            "duration": "1 round",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.",
            "level": "1",
            "name": "Command",
            "range": "60 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "cleric",
                "paladin",
                "level1"
            ],
            "type": "1st-level enchantment"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You attempt to compel a creature into a duel. One creature that you can see within range must make a Wisdom saving throw. On a failed save, the creature is drawn to you, compelled by your divine demand. For the duration, it has disadvantage on attack rolls against creatures other than you, and must make a Wisdom saving throw each time it attempts to move into a space that is more than 30 feet away from you; if it succeeds on this saving throw, the spell doesn't restrict the target's movement for that turn.\n\nThe spell ends if you attack any other creature, if you cast a spell that targets a hostile creature other than the target, if a creature friendly to you damages the target or casts a harmful spell on it, or if you end your turn more than 30 feet away from the target.",
            "duration": "Concentration, up to 1 minute",
            "level": "1",
            "name": "Compelled Duel",
            "range": "30 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "paladin",
                "level1"
            ],
            "type": "1st-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of soot and salt"
                ],
                "raw": "V, S, M (a pinch of soot and salt)",
                "somatic": true,
                "verbal": true
            },
            "description": "For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text.\n\nThis spell doesn\u2019t decode secret messages in a text or a glyph, such as an arcane sigil, that isn\u2019t part of a written language.",
            "duration": "1 hour",
            "level": "1",
            "name": "Comprehend Languages",
            "range": "Self",
            "ritual": true,
            "school": "divination",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level1"
            ],
            "type": "1st-level divination (Ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a drop of water if creating water, or a few grains of sand if destroying it"
                ],
                "raw": "V, S, M (a drop of water if creating water, or a few grains of sand if destroying it)",
                "somatic": true,
                "verbal": true
            },
            "description": "You either create or destroy water.\n\nCreate Water: You create up to 10 gallons of clean water within range in an open container. Alternatively, the water falls as rain in a 30-foot cube within range, extinguishing exposed flames in the area.\n\nDestroy Water: You destroy up to 10 gallons of water in an open container within range. Alternatively, you destroy fog in a 30-foot cube within range.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, you create or destroy 10 additional gallons of water, or the size of the cube increases by 5 feet, for each slot level above 1st.",
            "level": "1",
            "name": "Create or Destroy Water",
            "range": "30 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "cleric",
                "druid",
                "level1"
            ],
            "type": "1st-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "druid",
                "paladin",
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.",
            "level": "1",
            "name": "Cure Wounds",
            "range": "Touch",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "paladin",
                "ranger",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of phosphorus or wychwood, or a glowworm"
                ],
                "raw": "V, S, M (a bit of phosphorus or wychwood, or a glowworm)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create up to four torch-sized lights within range, making them appear as torches, lanterns, or glowing orbs that hover in the air for the duration. You can also combine the four lights into one glowing vaguely humanoid form of Medium size. Whichever form you choose, each light sheds dim light in a 10-foot radius. As a bonus action on your turn, you can move the lights up to 60 feet to a new spot within range. A light must be within 20 feet of another light created by this spell, and a light winks out if it exceeds the spell\u2019s range.",
            "duration": "Concentration, up to 1 minute",
            "level": "cantrip",
            "name": "Dancing Lights",
            "range": "120 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "cantrip"
            ],
            "type": "Evocation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "For the duration, you know if there is an aberration, celestial, elemental, fey, fiend, or undead within 30 feet of you, as well as where the creature is located. Similarly, you know if there is a place or object within 30 feet of you that has been magically consecrated or desecrated.\n\nThe spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.",
            "duration": "Concentration, up to 10 minutes",
            "level": "1",
            "name": "Detect Evil and Good",
            "range": "Self",
            "ritual": false,
            "school": "divination",
            "tags": [
                "cleric",
                "paladin",
                "level1"
            ],
            "type": "1st-level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "druid",
                "paladin",
                "ranger",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any.\n\nThe spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.",
            "duration": "Concentration, up to 10 minutes",
            "level": "1",
            "name": "Detect Magic",
            "range": "Self",
            "ritual": true,
            "school": "divination",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "paladin",
                "ranger",
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level divination (Ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid",
                "paladin",
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a yew leaf"
                ],
                "raw": "V, S, M (a yew leaf)",
                "somatic": true,
                "verbal": true
            },
            "description": "For the duration, you can sense the presence and location of poisons, poisonous creatures, and diseases within 30 feet of you. You also identify the kind of poison, poisonous creature, or disease in each case.\n\nThe spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.",
            "duration": "Concentration, up to 10 minutes",
            "level": "1",
            "name": "Detect Poison and Disease",
            "range": "Self",
            "ritual": true,
            "school": "divination",
            "tags": [
                "cleric",
                "druid",
                "paladin",
                "ranger",
                "level1"
            ],
            "type": "1st-level divination (Ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You make yourself -- including your clothing, armor, weapons, and other belongings on your person -- look different until the spell ends or until you use your action to dismiss it. You can seem 1 foot shorter or taller and can appear thin, fat, or in between. You can't change your body type, so you must adopt a form that has the same basic arrangement of limbs. Otherwise, the extent of the illusion is up to you.\n\nThe changes wrought by this spell fail to hold up to physical inspection. For example, if you use this spell to add a hat to your outfit, objects pass through the hat, and anyone who touches it would feel nothing or would feel your head and hair. If you use this spell to appear thinner than you are, the hand of someone who reaches out to touch you would bump into you while it was seemingly still in midair.\n\nTo discern that you are disguised, a creature can use its action to inspect your apperance and must succeed on an Intelligence (Investigation) check against your spell save DC.",
            "duration": "1 hour",
            "level": "1",
            "name": "Disguise Self",
            "range": "Self",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "cleric (trickery)",
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level illusion"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Your prayer empowers you with divine radiance. Until the spell ends, your weapon attacks deal an extra 1d4 radiant damage on a hit.",
            "duration": "Concentration, up to 1 minute",
            "level": "1",
            "name": "Divine Favor",
            "range": "Self",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "paladin",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You whisper a discordant melody that only one creature of your choice within range can hear, wracking it with terrible pain. The target must make a Wisdom saving throw. On a failed save, it takes 3d6 psychic damage and must immediately use its reaction, if available, to move as far as its speed allows away from you. The creature doesn't move into obviously dangerous ground, such as a fire or a pit. On a successful save, the target takes half as much damage and doesn't have to move away. A deafened creature automatically succeeds on the save.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
            "level": "1",
            "name": "Dissonant Whispers",
            "range": "60 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "level1"
            ],
            "type": "1st-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Whispering to the spirits of nature, you create one of the following effects within range:\n\n* You create a tiny, harmless sensory effect that predicts what the weather will be at your location for the next 24 hours. The effect might manifest as a golden orb for clear skies, a cloud for rain, falling snowflakes for snow, and so on. This effect persists for 1 round.\n\n* You instantly make a flower bloom, a seed pod open, or a leaf bud bloom.\n\n* You create an instantenous, harmless sensory effect, such as falling leaves, a puff of wind, the sound of a small animal, or the faint order of skunk. The effect must fit in a 5-foot cube.\n\n* You instantly light or snuff out a candle, a torch, or a small campfire.",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Druidcraft",
            "range": "30 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "cantrip"
            ],
            "type": "Transmutation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "warlock"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.\nThe spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Eldritch Blast",
            "range": "120 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "warlock",
                "cantrip"
            ],
            "type": "Evocation cantrip"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "The next time you hit a creature with a weapon attack before this spell ends, a writhing mass of thorny vines appears at the point of impact, and the target must succeed on a Strength saving throw or be restrained by the magical vines until the spell ends. A Large or larger creature has advantage on this saving throw. If the target succeeds on the save, the vines shrivel away.\n\nWhile restrained by this spell, the target takes 1d6 piercing damage at the start of each of its turns. A creature restrained by the vines or one that can touch a creature can use its action to make a Strength check against your spell save DC. On a success, the target is freed.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "If you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
            "level": "1",
            "name": "Ensnaring Strike",
            "range": "Self",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "ranger",
                "level1"
            ],
            "type": "1st-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Grasping weeds and vines sprout from the ground in a 20-foot square starting form a point within range. For the duration, these plants turn the ground in the area into difficult terrain.\n\nA creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends. A creature restrained by the plants can use its action to make a Strength check against your spell save DC. On a success, it frees itself.\n\nWhen the spell ends, the conjured plants wilt away.",
            "duration": "Concentration, up to 1 minute",
            "level": "1",
            "name": "Entangle",
            "range": "90 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "level1"
            ],
            "type": "1st-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice). Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius.\n\nAny attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can't benefit from being invisible.",
            "duration": "Concentration, up to 1 minute",
            "level": "1",
            "name": "Faerie Fire",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "bard",
                "druid",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell allows you to move at an incredible pace. When you cast this spell, and then as a bonus action on each of your turns until the spell ends, you can take the Dash action.",
            "duration": "Concentration, up to 10 minutes",
            "level": "1",
            "name": "Expeditious Retreat",
            "range": "Self",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "warlock",
                "wizard",
                "level1"
            ],
            "type": "1st-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a small amount of alcohol or distilled spirits"
                ],
                "raw": "V, S, M (a small amount of alcohol or distilled spirits)",
                "somatic": true,
                "verbal": true
            },
            "description": "Bolstering yourself with a necromantic facsimile of life, you gain 1d4 + 4 temporary hit points for the duration.",
            "duration": "1 hour",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, you gain 5 additional temporary hit points for each slot level above 1st.",
            "level": "1",
            "name": "False Life",
            "range": "Self",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level necromancy"
        },
        {
            "casting_time": "1 reaction, which you take when you or a creature within 60 feet of you falls",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a small feather or a piece of down"
                ],
                "raw": "V, M (a small feather or a piece of down)",
                "somatic": false,
                "verbal": true
            },
            "description": "Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 feet per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage and can land on its feet, and the spell ends for that creature.",
            "duration": "1 minute",
            "level": "1",
            "name": "Feather Fall",
            "range": "60 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level transmutation"
        },
        {
            "casting_time": "1 hour",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "10gp worth of charcoal, incense, and herbs that must be consumed by fire in a brass brazier"
                ],
                "raw": "V, S, M (10gp worth of charcoal, incense, and herbs that must be consumed by fire in a brass brazier)",
                "somatic": true,
                "verbal": true
            },
            "description": "Your familiar acts independently of you, but it always obeys your commands. In combat, it rolls its own initiative and acts on its own turn. A familiar can't attack, but it can take other actions as normal.\n\nWhen the familiar drops to 0 hit points, it disappears, leaving behind no physical form. It reappears after you cast this spell again.\n\nWhile your familiar is within 100 feet of you, you can communicate with it telepathically. Additionally, as an action, you can see through your familiar's eyes and hear what it hears until the start of your next turn, gaining the benefits of any special senses that the familiar has. During this time, you are deaf and blind with regard to your own senses.\n\nAs an action, you can temporarily dismiss your familiar. It disappears into a pocket dimension where it awaits your summons. Alternatively, you can dismiss it forever. As an action while it is temporarily dismissed, you can cause it to reappear in any unoccupied space within 30 feet of you.\n\nYou can't have more than one familiar at a time. If you cast this spell while you already have a familiar, you instead cause it to adopt a new form. Choose one of the forms from the above list. Your familiar transforms into the chosen creature.\n\nFinally, when you cast a spell with a range of touch, your familiar can deliver the spell as if it had cast the spell. Your familiar must be within 100 feet of you, and it must use its reaction to deliver the spell when you cast it. If the spell requires an attack roll, you use your action modifier for the roll.",
            "duration": "Instantaneous",
            "level": "1",
            "name": "Find Familiar",
            "range": "10 feet",
            "ritual": true,
            "school": "conjuration",
            "tags": [
                "wizard",
                "level1"
            ],
            "type": "1st-level conjuration (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried. This spell\u2019s damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Fire Bolt",
            "range": "120 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "cantrip"
            ],
            "type": "Evocation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st.",
            "level": "1",
            "name": "Fog Cloud",
            "range": "120 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "ranger",
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a small amount of makeup applied to the face as this spell is cast"
                ],
                "raw": "S, M (a small amount of makeup applied to the face as this spell is cast)",
                "somatic": true,
                "verbal": false
            },
            "description": "For the duration, you have advantage on all Charisma checks directed at one creature of your choice that isn't hostile toward you. When the spell ends, the creature realizes that you have used magic to influence its mood and becomes hostile toward you. A creature prone to violence might attack you. Another creature might seek retribution in other ways (at the DM's discretion), depending on the nature of your interaction with it.",
            "duration": "Concentration, up to 1 minute",
            "level": "cantrip",
            "name": "Friends",
            "range": "Self",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "cantrip"
            ],
            "type": "Enchantment cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a sprig of mistletoe"
                ],
                "raw": "V, S, M (a sprig of mistletoe)",
                "somatic": true,
                "verbal": true
            },
            "description": "Up to ten berries appear in your hand and are infused with magic for the duration. A creature can use its action to eat one berry. Eating a berry restores 1 hit point, and the berry provides enough nourishment to sustain a creature for a day.\n\nThe berries lose their potency if they have not been consumed within 24 hours of the casting of this spell.",
            "duration": "Instantaneous",
            "level": "1",
            "name": "Goodberry",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "ranger",
                "level1"
            ],
            "type": "1st-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of pork rind or butter"
                ],
                "raw": "V, S, M (a bit of pork rind or butter)",
                "somatic": true,
                "verbal": true
            },
            "description": "Slick grease covers the ground in a 10-foot square centered on a point within range and turns it into difficult terrain for the duration.\n\nWhen the grease appears, each creature standing in its area must succeed on a Dexterity saving throw or fall prone. A creature that enters the area or ends its turn there must also succeed on a Dexterity saving throw or fall prone.",
            "duration": "1 minute",
            "level": "1",
            "name": "Grease",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "wizard",
                "level1"
            ],
            "type": "1st-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.",
            "duration": "Concentration, up to 1 minute",
            "level": "cantrip",
            "name": "Guidance",
            "range": "Touch",
            "ritual": false,
            "school": "divination",
            "tags": [
                "cleric",
                "druid",
                "cantrip"
            ],
            "type": "Divination cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage, thanks to the mystical dim light glittering on the target until then.",
            "duration": "1 round",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
            "level": "1",
            "name": "Guiding Bolt",
            "range": "120 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "cleric",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "The next time you hit a creature with a ranged weapon attack before this spell ends, this spell creates a rain of thorns that sprouts from your ranged weapon or ammunition. In addition to the normal effects of the attack, the target of the attack and each creature within 5 feet of it must make a Dexterity saving throw. A creature takes 1d10 piercing damage on a failed save, or half as much damage on a successful one.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "If you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st (to a maximum of 6d10).",
            "level": "1",
            "name": "Hail of Thorns",
            "range": "Self",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "ranger",
                "level1"
            ],
            "type": "1st-level conjuration"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "bard",
                "cleric",
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st.",
            "level": "1",
            "name": "Healing Word",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 reaction, which you take in response to being damaged by a creature within 60 feet of you that you can see.",
            "classes": [
                "warlock"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You point your finger, and the creature that damaged you is momentarily surrounded by hellish flames. The creature must make a Dexterity saving throw. It takes 2d10 fire damage on a failed save, or half as much damage on a successful one.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.",
            "level": "1",
            "name": "Hellish Rebuke",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "warlock",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "warlock"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "the petrified eye of a newt"
                ],
                "raw": "V, S, M (the petrified eye of a newt)",
                "somatic": true,
                "verbal": true
            },
            "description": "You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 necrotic damage to the target whenever you hit it with an attack. Also choose one ability when you cast the spell. The target has disadvantage on ability checks made with the chosen ability.\n\nIf the target drops to 0 hit points before this spell ends, you can use a bonus action on a subsequent turn of yours to curse a new creature.\n\nA *[remove curse](../remove-curse/)* cast on the target ends this spell early.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell using a spell slot of 3rd or 4th level, you can maintain your concentration on the spell for up to 8 hours. When you use a spell slot of 5th level or higher, you can maintain your concentration on the spell for up to 24 hours.",
            "level": "1",
            "name": "Hex",
            "range": "90 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "warlock",
                "level1"
            ],
            "type": "1st-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A willing creature you touch is imbued with bravery. Until the spell ends, the creature is immune to being frightened and gains temporary hit points equal to your spellcasting ability modifier at the start of each of its turns. When the spell ends, the target loses any remaining temporary hit points from this spell.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.",
            "level": "1",
            "name": "Heroism",
            "range": "Touch",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "paladin",
                "level1"
            ],
            "type": "1st-level enchantment"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You choose a creature you can see within range and mystically mark it as your quarry. Until the spell ends, you deal an extra 1d6 damage to the target whenever you hit it with a weapon attack, and you have advantage on any Wisdom (Perception) or Wisdom (Survival) check you make to find it. If the target drops to 0 hit points before this spell ends, you can use a bonus action on a subsequent turn of yours to mark a new creature.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell using a spell slot of 3rd or 4th level, you can maintain your concentration on the spell for up to 8 hours. When you use a spell slot of 5th level or higher, you can maintain your concentration on the spell for up to 24 hours.",
            "level": "1",
            "name": "Hunter's Mark",
            "range": "90 feet",
            "ritual": false,
            "school": "divination",
            "tags": [
                "ranger",
                "level1"
            ],
            "type": "1st-level divination"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "bard",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pearl worth at least 100 gp and an owl feather"
                ],
                "raw": "V, S, M (a pearl worth at least 100 gp and an owl feather)",
                "somatic": true,
                "verbal": true
            },
            "description": "You choose one object that you must touch throughout the casting of the spell. If it is a magic item or some other magic-imbued object, you learn its properties and how to use them, whether it requires attunement to use, and how many charges it has, if any. You learn whether any spells are affecting the item and what they are. If the item was created by a spell, you learn which spell created it.\n\nIf you instead touch a creature throughout the casting, you learn what spells, if any, are currently affecting it.",
            "duration": "Instantaneous",
            "level": "1",
            "name": "Identify",
            "range": "Touch",
            "ritual": true,
            "school": "divination",
            "tags": [
                "bard",
                "wizard",
                "level1"
            ],
            "type": "1st-level divination (Ritual)"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "bard",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a lead-based ink worth at least 10gp, which this spell consumes"
                ],
                "raw": "S, M (a lead-based ink worth at least 10gp, which this spell consumes)",
                "somatic": true,
                "verbal": false
            },
            "description": "You write on parchment, paper, or some other suitable writing material and imbue it with a potent illusion that lasts for the duration.\n\nTo you and any creatures you designate when you cast the spell, the writing appears normal, written in your hand, and conveys whatever meaning you intended when you wrote the text. To all others, the writing appears as if it were written in an unknown or magical script that is unintelligible. Alternatively, you can cause the writing to appear to be an entirely different message, written in a different hand and language, though the language must be one you know.\n\nShould the spell be dispelled, the original script and the illusion both disappear.\n\nA creature with truesight can read the hidden message.",
            "duration": "10 days",
            "level": "1",
            "name": "Illusory Script",
            "range": "Touch",
            "ritual": true,
            "school": "illusion",
            "tags": [
                "bard",
                "warlock",
                "wizard",
                "level1"
            ],
            "type": "1st-level illusion (Ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.",
            "level": "1",
            "name": "Inflict Wounds",
            "range": "Touch",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "cleric",
                "level1"
            ],
            "type": "1st-level necromancy"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a grasshopper's hind leg"
                ],
                "raw": "V, S, M (a grasshopper's hind leg)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a creature. The creature's jump distance is tripled until the spell ends.",
            "duration": "1 minute",
            "level": "1",
            "name": "Jump",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "ranger",
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a firefly or phosphorescent moss"
                ],
                "raw": "V, M (a firefly or phosphorescent moss)",
                "somatic": false,
                "verbal": true
            },
            "description": "You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet. The light can be colored as you like. Completely covering the object with something opaque blocks the light. The spell ends if you cast it again or dismiss it as an action.\n\nIf you target an object held or worn by a hostile creature, that creature must succeed on a Dexterity saving throw to avoid the spell.",
            "duration": "1 hour",
            "level": "cantrip",
            "name": "Light",
            "range": "Touch",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "bard",
                "cleric",
                "sorcerer",
                "wizard",
                "cantrip"
            ],
            "type": "Evocation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "ranger",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of dirt"
                ],
                "raw": "V, S, M (a pinch of dirt)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a creature. The target's speed increases by 10 feet until the spell ends.",
            "duration": "1 hour",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each spell slot above 1st.",
            "level": "1",
            "name": "Longstrider",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "druid",
                "ranger",
                "wizard",
                "level1"
            ],
            "type": "1st-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a piece of cured leather"
                ],
                "raw": "V, S, M (a piece of cured leather)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a willing creature who isn\u2019t wearing armor, and a protective magical force surrounds it until the spell ends. The target\u2019s base AC becomes 13 + its Dexterity modifier. The spell ends if the target dons armor or if you dismiss the spell as an action.",
            "duration": "8 hours",
            "level": "1",
            "name": "Mage Armor",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again.\n\nYou can use your action to control the hand. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial. You can move the hand up to 30 feet each time you use it.\n\nThe hand can\u2019t attack, activate magic items, or carry more than 10 pounds.",
            "duration": "1 minute",
            "level": "cantrip",
            "name": "Mage Hand",
            "range": "30 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "cantrip"
            ],
            "type": "Conjuration cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st.",
            "level": "1",
            "name": "Magic Missile",
            "range": "120 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "bard",
                "cleric",
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "two lodestones"
                ],
                "raw": "V, S, M (two lodestones)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell repairs a single break or tear in an object you touch, such as a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no longer than 1 foot in any dimension, you mend it, leaving no trace of the former damage.\n\nThis spell can physically repair a magic item or construct, but the spell can\u2019t restore magic to such an object.",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Mending",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "sorcerer",
                "wizard",
                "cantrip"
            ],
            "type": "Transmutation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a short piece of copper wire"
                ],
                "raw": "V, S, M (a short piece of copper wire)",
                "somatic": true,
                "verbal": true
            },
            "description": "You point your finger toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear.\n\nYou can cast this spell through solid objects if you are familiar with the target and know it is beyond the barrier. Magical silence, 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood blocks the spell. The spell doesn't have to follow a straight line and can travel freely around corners or through openings.",
            "duration": "1 round",
            "level": "cantrip",
            "name": "Message",
            "range": "120 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "cantrip"
            ],
            "type": "Transmutation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of fleece"
                ],
                "raw": "S, M (a bit of fleece)",
                "somatic": true,
                "verbal": false
            },
            "description": "You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it as an action or cast this spell again.\n\nIf you create a sound, its volume can range from a whisper to a scream. It can be your voice, someone else\u2019s voice, a lion\u2019s roar, a beating of drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the spell ends.\n\nIf you create an image of an object\u2014such as a chair, muddy footprints, or a small chest\u2014it must be no larger than a 5-foot cube. The image can\u2019t create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion, because things can pass through it.\n\nIf a creature uses its action to examine the sound or image, the creature can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to the creature.",
            "duration": "1 minute",
            "level": "cantrip",
            "name": "Minor Illusion",
            "range": "30 feet",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "cantrip"
            ],
            "type": "Illusion cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a Constitution saving throw or take 1d12 poison damage.\n\nThis spell's damage increases by 1d12 when you reach 5th level (2d12), 11th level (3d12), and 17th level (4d12).",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Poison Spray",
            "range": "10 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard",
                "cantrip"
            ],
            "type": "Conjuration cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell is a minor magical trick that novice spellcasters use for practice. You create one of the following magical effects within range:\n\n* You create an instantaneous, harmless sensory effect, such as a shower of sparks, a puff of wind, faint musical notes, or an odd odor.\n\n* You instantaneously light or snuff out a candle, a torch, or a small campfire.\n\n* You instantaneously clean or soil an object no larger than 1 cubic foot.\n\n* You chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour.\n\n* You make a color, a small mark, or a symbol appear on an object or a surface for 1 hour.\n\n* You create a nonmagical trinket or an illusory image that can fit in your hand and that lasts until the end of your next turn.\n\nIf you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at a time, and you can dismiss such an effect as an action.",
            "duration": "Up to 1 hour",
            "level": "cantrip",
            "name": "Prestidigitation",
            "range": "10 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "cantrip"
            ],
            "type": "Transmutation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A flickering flame appears in your hand. The flame remains there for the duration and harms neither you nor your equipment. The flame sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The spell ends if you dismiss it as an action or if you cast it again.\n\nYou can also attack with the flame, although doing so ends the spell. When you cast this spell, or as an action on a later turn, you can hurl the flame at a creature within 30 feet of you. Make a ranged spell attack. On a hit, the target takes 1d8 fire damage.\n\nThis spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
            "duration": "10 minutes",
            "level": "cantrip",
            "name": "Produce Flame",
            "range": "Self",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "cantrip"
            ],
            "type": "Conjuration cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "paladin",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "holy water or powdered silver and iron, which the spell consumes"
                ],
                "raw": "V, S, M (holy water or powdered silver and iron, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "Until the spell ends, one willing creature you touch is protected against certain types of creatures:  aberrations, celestials, elementals, fey, fiends, and undead.\n\nThe protection grants several benefits. Creatures of those types have disadvantage on attack rolls against the target. The target also can't be charmed, frightened, or possessed by them. If the target is already charmed, frightened, or possessed by such a creature, the target has advantage on any new saving throw against the relevant effect.",
            "duration": "Concentration, up to 10 minutes",
            "level": "1",
            "name": "Protection from Evil and Good",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "paladin",
                "warlock",
                "wizard",
                "level1"
            ],
            "type": "1st-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid",
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "All nonmagical food and drink within a 5-foot radius sphere centered on a point of your choice within range is purified and rendered free of poison and disease.",
            "duration": "Instantaneous",
            "level": "1",
            "name": "Purify Food and Drink",
            "range": "10 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "cleric",
                "druid",
                "paladin",
                "level1"
            ],
            "type": "1st-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn.\n\nThe spell\u2019s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Ray of Frost",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "cantrip"
            ],
            "type": "Evocation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A ray of sickening greenish energy lashes out toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 2d8 poison damage and must make a Constitution saving throw. On a failed save, it is also poisoned until the end of your next turn.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.",
            "level": "1",
            "name": "Ray of Sickness",
            "range": "60 feet",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level necromancy"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "paladin",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "At your touch, all curses affecting one creature or object end. If the object is a cursed magical item, its curse remains, but the spell breaks its owner's attunement to the object so it can be removed or discarded.",
            "duration": "Instantaneous",
            "level": "3",
            "name": "Remove Curse",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "paladin",
                "warlock",
                "wizard",
                "level3"
            ],
            "type": "3rd-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a miniature cloak"
                ],
                "raw": "V, S, M (a miniature cloak)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one saving throw of its choice. It can roll the die before or after making the saving throw. The spell then ends.",
            "duration": "Concentration, up to 1 minute",
            "level": "cantrip",
            "name": "Resistance",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "druid",
                "cantrip"
            ],
            "type": "Abjuration cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw.\n\nThe spell\u2019s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Sacred Flame",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "cleric",
                "cantrip"
            ],
            "type": "Evocation cantrip"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a small silver mirror"
                ],
                "raw": "V, S, M (a small silver mirror)",
                "somatic": true,
                "verbal": true
            },
            "description": "You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell. This spell doesn\u2019t protect the warded creature from area effects, such as the explosion of a fireball.\n\nIf the warded creature makes an attack or casts a spell that affects an enemy creature, this spell ends.",
            "duration": "1 minute",
            "level": "1",
            "name": "Sanctuary",
            "range": "30 feet",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "level1"
            ],
            "type": "1st-level abjuration"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "cleric",
                "paladin"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a small parchment with a bit of holy text written on it"
                ],
                "raw": "V, S, M (a small parchment with a bit of holy text written on it)",
                "somatic": true,
                "verbal": true
            },
            "description": "A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.",
            "duration": "Concentration, up to 10 minutes",
            "level": "1",
            "name": "Shield of Faith",
            "range": "60 feet",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "paladin",
                "level1"
            ],
            "type": "1st-level abjuration"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "The next time you hit a creature wiht a melee weapon attack during the spell's duration, your weapon flares with white-hot intensity, and the attack deals an extra 1d6 fire damage to the target and causes the target to ignite in flames. At the start of each of its turns until the spell ends, the target must make a Constitution saving throw. On a failed save, it takes 1d6 fire damage. On a successful save, the spell ends. If the target or a creature within 5 feet of it uses an action to put out the flames, or if some other effect douses the flames (such as the target being submerged in water), the spell ends.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the initial extra damage dealt by the attack increases by 1d6 for each slot level above 1st.",
            "level": "1",
            "name": "Searing Smite",
            "range": "Self",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "paladin",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 reaction, which you take when you are hit by an attack or targeted by the magic missile spell",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.",
            "duration": "1 round",
            "level": "1",
            "name": "Shield",
            "range": "Self",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level abjuration"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "mistletoe, a shamrock leaf, and a club or quarterstaff"
                ],
                "raw": "V, S, M (mistletoe, a shamrock leaf, and a club or quarterstaff)",
                "somatic": true,
                "verbal": true
            },
            "description": "The wood of a club or a quarterstaff you are holding is imbued with nature's power. For the duration, you can use your spellcasting ability instead of Strength for the attack and damage rolls of melee attacks using that weapon, and the weapon's damage die becomes a d8. The weapon also becomes magical, if it isn't already. The spell ends if you cast it again or if you let go of the weapon.",
            "duration": "1 minute",
            "level": "cantrip",
            "name": "Shillelagh",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "cantrip"
            ],
            "type": "Transmutation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Lightning springs from your hand to deliver a shock to a creature you try to touch. Make a melee spell attack against the target. You have advantage on the attack roll if the target is wearing armor made of metal. On a hit, the target takes 1d8 lightning damage, and it can\u2019t take reactions until the start of its next turn.\n\nThe spell\u2019s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Shocking Grasp",
            "range": "Touch",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "cantrip"
            ],
            "type": "Evocation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of fleece"
                ],
                "raw": "V, S, M (a bit of fleece)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 15-foot cube. The image appears at a spot within range and lasts for the duration. The image is purely visual; it isn\u2019t accompanied by sound, smell, or other sensory effects.\n\nYou can use your action to cause the image to move to any spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image. For example, if you create an image of a creature and move it, you can alter the image so that it appears to be walking.\n\nPhysical interaction with the image reveals it to be an illusion, because things can pass through it. A creature that uses its action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image.",
            "duration": "Concentration, up to 10 minutes",
            "level": "1",
            "name": "Silent Image",
            "range": "60 feet",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level illusion"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of fine sand, rose petals, or a cricket"
                ],
                "raw": "V, S, M (a pinch of fine sand, rose petals, or a cricket)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell sends creatures into a magical slumber. Roll 5d8; the total is how many hit points of creatures this spell can affect. Creatures within 20 feet of a point you choose within range are affected in ascending order of their current hit points (ignoring unconscious creatures).\n\nStarting with the creature that has the lowest current hit points, each creature affected by this spell falls unconscious until the spell ends, the sleeper takes damage, or someone uses an action to shake or slap the sleeper awake. Subtract each creature\u2019s hit points from the total before moving on to the creature with the next lowest hit points. A creature\u2019s hit points must be equal to or less than the remaining total for that creature to be affected.\n\nUndead and creatures immune to being charmed aren\u2019t affected by this spell.",
            "duration": "1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, roll an additional 2d8 for each slot level above 1st.",
            "level": "1",
            "name": "Sleep",
            "range": "90 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a living creature that has 0 hit points. The creature becomes stable. This spell has no effect on undead or constructs.",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Spare the Dying",
            "range": "Touch",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "cleric",
                "cantrip"
            ],
            "type": "Necromancy cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You gain the ability to comprehend and verbally communicate with beasts for the duration. The knowledge and awareness of many beasts is limited by their intelligence, but at a minimum, beasts can give you information about nearby locations and monsters, including whatever they can perceive or have perceived within the past day. You might be able to persuade a beast to perform a small favor for you, at the DM's discretion.",
            "duration": "10 minutes",
            "level": "1",
            "name": "Speak with Animals",
            "range": "Self",
            "ritual": true,
            "school": "divination",
            "tags": [
                "bard",
                "druid",
                "ranger",
                "level1"
            ],
            "type": "1st-level divination (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You manifest a minor wonder, a sign of supernatural power, within range.  You create one of the following magial effects within range:\n\n* Your voice booms up to three times as loud as normal for 1 minute.\n\n* You cause flames to flicker, brighten, dim, or change color for 1 minute.\n\n* You cause harmless tremors in the ground for 1 minute.\n\n* You create an instantaneous sound that originates from a point of your choice within range, such as a rumble of thunder, the cry of a raven, or ominous whispers.\n\n* You instantaneously cause an unlocked door or window to fly open or slam shut.\n\n* You alter the appearance of your eyes for 1 minute.\n\nIf you cast this spell multiple times, you can have up to three of its 1-minute effects active at a time, and you can dismiss such an effect as an action.",
            "duration": "Up to 1 minute",
            "level": "cantrip",
            "name": "Thaumaturgy",
            "range": "30 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "cleric",
                "cantrip"
            ],
            "type": "Transmutation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "the stem of a plant with thorns"
                ],
                "raw": "V, S, M (the stem of a plant with thorns)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a long, vine-like whip covered in thorns that lashes out at your command toward a creature in range. Make a melee spell attack against the target. If the attack hits, the creature takes 1d6 piercing damage, and if the creature is Large or smaller, you pull the creature up to 10 feet closer to you.\n\nThis spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Thorn Whip",
            "range": "30 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "cantrip"
            ],
            "type": "Transmutation cantrip"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "The first time you hit with a melee weapon attack during this spell's duration, your weapon rings with thunder that is audible within 300 feet of you, and the attack deals an extra 2d6 thunder damage to the target. Additionally, if the target is a creature, it must succeed on a Strength saving throw or be pushed 10 feet away from you and knocked prone.",
            "duration": "Concentration, up to 1 minute",
            "level": "1",
            "name": "Thunderous Smite",
            "range": "Self",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "paladin",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn\u2019t pushed. In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell\u2019s effect, and the spell emits a thunderous boom audible out to 300 feet.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.",
            "level": "1",
            "name": "Thunderwave",
            "range": "Self (15-foot cube)",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "bard",
                "druid",
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "S",
                "somatic": true,
                "verbal": false
            },
            "description": "You extend your hand and point a finger at a target in range. Your magic grants you a brief insight into the target's defenses. On your next turn, you gain advantage on your first attack roll against the target, provided that this spell hasn't ended.",
            "duration": "Concentration, up to 1 round",
            "level": "cantrip",
            "name": "True Strike",
            "range": "30 feet",
            "ritual": false,
            "school": "divination",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "cantrip"
            ],
            "type": "Divination cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a piece of string and a bit of wood"
                ],
                "raw": "V, S, M (a piece of string and a bit of wood)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell creates an invisible, mindless, shapeless force that performs simple tasks at your command until the spell ends. The servant springs into existence in an unoccupied space on the ground within range. It has AC 10, 1 hit point, and a Strength of 2, and it can't attack. If it drops to 0 hit points, the spell ends.\n\nOnce on each of your turns as a bonus action, you can mentally command the servant to move up to 15 feet and interact with an object. The servant can perform simple tasks that a human servant could do, such as fetching things, cleaning, mending, folding clothes, lighting fires, serving food, and pouring wine. Once you give the command, the servant performs the task to the best of its ability until it completes the task, then waits for your next command.\n\nIf you command the servant to perform a task that would move it more than 60 feet away from you, the spell ends.",
            "duration": "1 hour",
            "level": "1",
            "name": "Unseen Servant",
            "range": "60 feet",
            "ritual": true,
            "school": "conjuration",
            "tags": [
                "bard",
                "warlock",
                "wizard",
                "level1"
            ],
            "type": "1st-level conjuration (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You unleash a string of insults laced with subtle enchantments at a creature you can see within range. If the target can hear you (though it need not understand you), it must succeed on a Wisdom saving throw or take 1d4 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn.\n\nThis spell's damage increases by 1d4 when you reach 5th level (2d4), 11th level (3d4), and 17th level (4d4).",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Vicious Mockery",
            "range": "60 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "cantrip"
            ],
            "type": "Enchantment cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a twig from a tree that has been struck by lightning"
                ],
                "raw": "V, S, M (a twig from a tree that has been struck by lightning)",
                "somatic": true,
                "verbal": true
            },
            "description": "A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell's range or if it has total cover from you.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d12 for each slot level above 1st.",
            "level": "1",
            "name": "Witch Bolt",
            "range": "30 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "warlock",
                "wizard",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "The next time you hit with a melee weapon attack during this spell's duration, your attack deals an extra 1d6 psychic damage. Additionally, if the target is a creature, it must make a Wisdom saving throw or be frightened of you until the spell ends. As an action, the creature can make a Wisdom check against your spell save DC to steel its resolve and end this spell.",
            "duration": "Concentration, up to 1 minute",
            "level": "1",
            "name": "Wrathful Smite",
            "range": "Self",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "paladin",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "paladin"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a tiny strip of white cloth"
                ],
                "raw": "V, S, M (a tiny strip of white cloth)",
                "somatic": true,
                "verbal": true
            },
            "description": "Your spell bolsters your allies with toughness and resolve. Choose up to three creatures within range. Each target\u2019s hit point maximum and current hit points increase by 5 for the duration.",
            "duration": "8 hours",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, a target\u2019s hit points increase by an additional 5 for each slot level above 2nd.",
            "level": "2",
            "name": "Aid",
            "range": "30 feet",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "paladin",
                "level2"
            ],
            "type": "2nd-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a morsel of food"
                ],
                "raw": "V, S, M (a morsel of food)",
                "somatic": true,
                "verbal": true
            },
            "description": "By means of this spell, you use an animal to deliver a message. Choose a Tiny beast you can see within range, such as a squirrel, a blue jay, or a bat. You specify a location, which you must have visited, and a recipient who matches a general description, such as \u201ca man or woman dressed in the uniform of the town guard\u201d or \u201ca red-haired dwarf wearing a pointed hat.\u201d You also speak a message of up to twenty-five words. The target beast travels for the duration of the spell toward the specified location, covering about 50 miles per 24 hours for a flying messenger, or 25 miles for other animals.\n\nWhen the messenger arrives, it delivers your message to the creature that you described, replicating the sound of your voice. The messenger speaks only to a creature matching the description you gave. If the messenger doesn\u2019t reach its destination before the spell ends, the message is lost, and the beast makes its way back to where you cast this spell.",
            "duration": "24 hours",
            "higher_levels": "If you cast this spell using a spell slot of 3rd level or higher, the duration of the spell increases by 48 hours for each slot level above 2nd.",
            "level": "2",
            "name": "Animal Messenger",
            "range": "30 feet",
            "ritual": true,
            "school": "enchantment",
            "tags": [
                "bard",
                "druid",
                "ranger",
                "level2"
            ],
            "type": "2nd-level enchantment (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You can blind or deafen a foe. Choose one creature that you can see within range to make a Constitution saving throw. If it fails, the target is either blinded or deafened (your choice) for the duration. At the end of each of its turns, the target can make a Constitution saving throw. On a success, the spell ends.",
            "duration": "1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.",
            "level": "2",
            "name": "Blindness/Deafness",
            "range": "30 feet",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "bard",
                "cleric",
                "sorcerer",
                "wizard",
                "level2"
            ],
            "type": "2nd-level Necromancy"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "specially marked sticks, bones, or similar tokens worth at least 25 gp"
                ],
                "raw": "V, S, M (specially marked sticks, bones, or similar tokens worth at least 25 gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "By casting gem-inlaid sticks, rolling dragon bones, laying out ornate cards, or employing some other divining tool, you receive an omen from an otherworldly entity about the results of a specific course of action that you plan to take within the next 30 minutes. The DM chooses from the following possible omens:\n\n* *Weal*, for good results\n\n* *Woe*, for bad results\n\n* *Weal and woe*, for both good and bad results\n\n* *Nothing*, for results that aren\u2019t especially good or bad\n\nThe spell doesn\u2019t take into account any possible circumstances that might change the outcome, such as the casting of additional spells or the loss or gain of a companion.\n\nIf you cast the spell two or more times before completing your next long rest, there is a cumulative 25 percent chance for each casting after the first that you get a random reading. The DM makes this roll in secret.",
            "duration": "Instantaneous",
            "level": "2",
            "name": "Augury",
            "range": "Self",
            "ritual": true,
            "school": "divination",
            "tags": [
                "cleric",
                "level2"
            ],
            "type": "2nd-level divination (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You attempt to suppress strong emotions in a group of people. Each humanoid in a 20-foot-radius sphere centered on a point you choose within range must make a Charisma saving throw; a creature can choose to fail this saving throw if it wishes. If a creature fails its saving throw, choose one of the following two effects. You can suppress any effect causing a target to be charmed or frightened. When this spell ends, any suppressed effect resumes, provided that its duration has not expired in the meantime.\n\nAlternatively, you can make a target indifferent about creatures o f your choice that it is hostile toward. This indifference ends if the target is attacked or harmed by a spell or if it witnesses any of its friends being harmed. When the spell ends, the creature becomes hostile again, unless the DM rules otherwise.",
            "duration": "Concentration, up to 1 minute",
            "level": "2",
            "name": "Calm Emotions",
            "range": "60 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "cleric",
                "level2"
            ],
            "type": "2nd-level Enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "druid",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a small, straight piece of iron"
                ],
                "raw": "V, S, M (a small, straight piece of iron)",
                "somatic": true,
                "verbal": true
            },
            "description": "Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd. The humanoids must be within 30 feet of each other when you target them.",
            "level": "2",
            "name": "Hold Person",
            "range": "60 feet",
            "ritual": true,
            "school": "enchantment",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "sorcerer",
                "warlock",
                "wizard",
                "level2"
            ],
            "type": "2nd-level enchantment (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "druid",
                "paladin",
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned.",
            "duration": "Instantaneous",
            "level": "2",
            "name": "Lesser Restoration",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "paladin",
                "ranger",
                "level2"
            ],
            "type": "2nd-level abjuration"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "Up to six creatures of your choice that you can see within range each regain hit points equal to 2d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, the healing increases by 1d8 for each slot level above 2nd.",
            "level": "2",
            "name": "Prayer of Healing",
            "range": "30 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "cleric",
                "level2"
            ],
            "type": "2nd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it.",
            "duration": "Concentration, up to 10 minutes",
            "level": "2",
            "name": "Silence",
            "range": "120 feet",
            "ritual": true,
            "school": "illusion",
            "tags": [
                "bard",
                "cleric",
                "ranger",
                "level2"
            ],
            "type": "2nd-level illusion (ritual)"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a floating, spectral weapon within range that lasts for the duration or until you cast this spell again. When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon. On a hit, the target takes force damage equal to 1d8 + your spellcasting ability modifier.\n\nAs a bonus action on your turn, you can move the weapon up to 20 feet and repeat the attack against a creature within 5 feet of it. The weapon can take whatever form you choose. Clerics of deities who are associated with a particular weapon (as St. Cuthbert is known for his mace and Thor for his hammer) make this spell\u2019s effect resemble that weapon.",
            "duration": "1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for every two slot levels above 2nd.",
            "level": "2",
            "name": "Spiritual Weapon",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "cleric",
                "level2"
            ],
            "type": "2nd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pair of platinum rings worth at least 50 gp each, which you and the target must wear for the duration"
                ],
                "raw": "V, S, M (a pair of platinum rings worth at least 50 gp each, which you and the target must wear for the duration)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell wards a willing creature you touch and creates a mystic connection between you and the target until the spell ends. While the target is within 60 feet of you, it gains a +1 bonus to AC and saving throws, and it has resistance to all damage. Also, each time it takes damage, you take the same amount of damage.\n\nThe spell ends if you drop to 0 hit points or if you and the  target become separated by more than 60 feet. It also ends if the spell is cast again on either of the connected creatures. You can also dismiss the spell as an action.",
            "duration": "1 hour",
            "level": "2",
            "name": "Warding Bond",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "level2"
            ],
            "type": "2nd-level abjuration"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "cleric",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a drop of blood, a piece of flesh, and a pinch of bone dust"
                ],
                "raw": "V, S, M (a drop of blood, a piece of flesh, and a pinch of bone dust)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell creates an undead servant. Choose a pile of bones or a corpse of a Medium or Small humanoid within range. Your spell imbues the target with a foul mimicry of life, raising it as an undead creature. The target becomes a skeleton if you chose bones or a zombie if you chose a corpse (the DM has the creature\u2019s game statistics).\n\nOn each of your turns, you can use a bonus action to mentally command any creature you made with this spell if the creature is within 60 feet of you (if you control multiple creatures, you can command any or all of them at the same time, issuing the same command to each one). You decide what action the creature will take and where it will move during its next turn, or you can issue a general command, such as to guard a particular chamber or corridor. If you issue no commands, the creature only defends itself against hostile creatures. Once given an order, the creature continues to follow it until its task is complete.\n\nThe creature is under your control for 24 hours, after which it stops obeying any command you\u2019ve given it. To maintain control of the creature for another 24 hours, you must cast this spell on the creature again before the current 24-hour period ends. This use of the spell reasserts your control over up to four creatures you have animated with this spell, rather than animating a new one.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, you animate or reassert control over two additional undead creatures for each slot level above 3rd. Each of the creatures must come from a different corpse or pile of bones.",
            "level": "3",
            "name": "Animate Dead",
            "range": "10 feet",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "cleric",
                "wizard",
                "level3"
            ],
            "type": "3rd-level necromancy"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of bat fur"
                ],
                "raw": "V, S, M (a bit of bat fur)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create an invisible, magical eye within range that hovers in the for the duration.\n\nYou mentally recieve visual information from the eye, which has normal vision and darkvision out to 30 feet. The eye can look in every direction.\n\nAs an action, you can move the eye up to 30 feet in any direction. There is no limit to how far away from you the eye can move, but it can't enter another plane of existence. A solid barrier blocks the eye's movement, but the eye can pass through an opening as small as 1 inch in diameter.",
            "duration": "Concentration, up to 1 hour",
            "level": "4",
            "name": "Arcane Eye",
            "range": "30 feet",
            "ritual": false,
            "school": "divination",
            "tags": [
                "wizard",
                "level4"
            ],
            "type": "4th-level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "Life-preserving energy radiates from you in an aura with a 30-foot radius. Until the spell ends, the aura moves with you, centered on you. Each nonhostile creature in the aura (including you) has resistance to necrotic damage, and its hit point maximum can't be reduced. In addition, a nonhostile, living creature regains 1 hit point when it starts its turn in the aura with 0 hit points.",
            "duration": "Concentration, up to 10 minutes",
            "level": "4",
            "name": "Aura of Life",
            "range": "Self (30-foot radius)",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "paladin",
                "level4"
            ],
            "type": "4th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "Purifying energy radiates from you in an aura with a 30-foot radius. Until the spell ends, the aura moves with you, centered on you. Each nonhostile creature in the aura (including you) can't become diseased, has resistance to poison damage, and has advantage on saving throws against effects that cause any of the following conditions: blinded, charmed, deafened, frightened, paralyzed, poisoned, and stunned.",
            "duration": "Concentration, up to 10 minutes",
            "level": "4",
            "name": "Aura of Purity",
            "range": "Self (30-foot radius)",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "paladin",
                "level4"
            ],
            "type": "4th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "Healing energy radiates from you in an aura with a 30-foot radius. Until the spell ends, the aura moves with you, centered on you. You can use a bonus action to cause one creature in the aura (including you) to regain 2d6 hit points.",
            "duration": "Concentration, up to 1 minute",
            "level": "3",
            "name": "Aura Of Vitality",
            "range": "Self (30-foot radius)",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "paladin",
                "level3"
            ],
            "type": "3rd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "paladin",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "an item distasteful to the target"
                ],
                "raw": "V, S, M (an item distasteful to the target)",
                "somatic": true,
                "verbal": true
            },
            "description": "You attempt to send one creature that you can see within range to another plane of existence. The target must succeed on a Charisma saving throw or be banished.\n\nIf the target is native to the plane of existance you're on, you banish the target to a harmless demiplane. While there, the target is incapacitated. The target remains there until the spell ends, at which point the target reappears in the space it left or in the nearest unoccupied space if that space is occupied.\n\nIf the target is native to a different plane of existance than the one you're on, the target is banished with a faint popping noise, returning to its home plane. If the spell ends before 1 minute has passed, the target reappears in the space it left or in the nearest unoccupied space if that space is occupied. Otherwise, the target doesn't return.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th.",
            "level": "4",
            "name": "Banishment",
            "range": "60 feet",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "paladin",
                "sorcerer",
                "warlock",
                "wizard",
                "level4"
            ],
            "type": "4th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell bestows hope and vitality. Choose any number of creatures within range. For the duration, each target has advantage on Wisdom saving throws and death saving throws, and regains the maximum number of hit points possible from any healing.",
            "duration": "Concentration, up to 1 minute",
            "level": "3",
            "name": "Beacon of Hope",
            "range": "30 feet",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "level3"
            ],
            "type": "3rd-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Necromantic energy washes over a creature of your choice that you can see within range, draining moisture and vitality from it. The target must make a Constitution saving throw. The target takes 8d8 necrotic damage on a failed save, or half as much damage on a successful one. The spell has no effect on undead or constructs.\n\nIf you target a plant creature or a magical plant, it makes the saving throw with disadvantage, and the spell deals maximum damage to it.\n\nIf you target a nonmagical plant that isn't a creature, such as a tree or shrub, it doesn't make a saving throw; it simply withers and dies.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 5th level of higher, the damage increases by 1d8 for each slot level above 4th.",
            "level": "4",
            "name": "Blight",
            "range": "30 feet",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard",
                "level4"
            ],
            "type": "4th-level necromancy"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "* Choose one ability score. While cursed, the target has disadvantage on ability checks and saving throws made with that ability score.\n\n* While cursed, the target has disadvantage on attack rolls against you.\n\n* While cursed, the target must make a Wisdom saving throw at the start of each of its turns. If it fails, it wastes its action that turn doing nothing.\n\n* While the target is cursed, your attacks and spells deal an extra 1d8 necrotic damage to the target.\n\nA *[remove curse](../remove-curse/ \"remove curse (lvl 3)\")* spell ends this effect. At the DM\u2019s option, you may choose an alternative curse effect, but it should be no more powerful than those described above. The DM has final say on such a curse\u2019s effect.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "If you cast this spell using a spell slot of 4th level or higher, the duration is concentration, up to 10 minutes. If you use a spell slot of 5th level or higher, the duration is 8 hours. If you use a spell slot of 7th level or higher, the duration is 24 hours. If you use a 9th level spell slot, the spell lasts until it is dispelled. Using a spell slot of 5th level or higher grants a duration that doesn\u2019t require concentration.",
            "level": "3",
            "name": "Bestow Curse",
            "range": "Touch",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "bard",
                "cleric",
                "wizard",
                "level3"
            ],
            "type": "3rd-level necromancy"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "The next time you hit a creature with a melee weapon attack during this spell\u2019s duration, your weapon flares with bright light, and the attack deals an extra 3d8 radiant damage to the target. Additionally, the target must succeed on a Constitution saving throw or be blinded until the spell ends.\n\nA creature blinded by this spell makes another Constitution saving throw at the end of each of its turns. On a successful save, it is no longer blinded.",
            "duration": "Concentration, up to 1 minute",
            "level": "3",
            "name": "Blinding Smite",
            "range": "Self",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "paladin",
                "level3"
            ],
            "type": "3rd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Roll a d20 at the end of each of your turns for the duration of the spell. On a roll of 11 or higher, you vanish from your current plane of existence and appear in the Ethereal Plane (the spell fails and the casting is wasted if you were already on that plane). At the start of your next turn, and when the spell ends if you are on the Ethereal Plane, you return to an unoccupied space of your choice that you can see within 10 feet of the space you vanished from. If no unoccupied space is available within that range, you appear in the nearest unoccupied space (chosen at random if more than one space is equally near). You can dismiss this spell as an action.\n\nWhile on the Ethereal Plane, you can see and hear the plane you originated from, which is cast in shades of gray, and you can\u2019t see anything there more than 60 feet away. You can only affect and be affected by other creatures on the Ethereal Plane. Creatures that aren\u2019t there can\u2019t perceive you or interact with you, unless they have the ability to do so.",
            "duration": "1 minute",
            "level": "3",
            "name": "Blink",
            "range": "Self",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "wizard",
                "level3"
            ],
            "type": "3rd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A storm cloud appears in the shape of a cylinder that is 10 feet tall with a 60-foot radius, centered on a point you can see 100 feet directly above you. The spell fails if you can\u2019t see a point in the air where the storm cloud could appear (for example, if you are in a room that can\u2019t accommodate the cloud).\n\nWhen you cast the spell, choose a point you can see within range. A bolt of lightning flashes down from the cloud to that point. Each creature within 5 feet of that point must make a Dexterity saving throw. A creature takes 3d10 lightning damage on a failed save, or half as much damage on a successful one. On each of your turns until the spell ends, you can use your action to call down lightning in this way again, targeting the same point or a different one.\n\nIf you are outdoors in stormy conditions when you cast this spell, the spell gives you control over the existing storm instead of creating a new one. Under such conditions, the spell\u2019s damage increases by 1d10.",
            "duration": "Concentration, up to 10 minutes",
            "higher_levels": "When you cast this spell using a spell slot of 4th or higher level, the damage increases by 1d10 for each slot level above 3rd.",
            "level": "3",
            "name": "Call Lightning",
            "range": "120 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "level3"
            ],
            "type": "3rd-level conjuration"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "bard",
                "cleric",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a focus worth at least 100gp, either a jeweled horn for hearing or a glass eye for seeing"
                ],
                "raw": "V, S, M (a focus worth at least 100gp, either a jeweled horn for hearing or a glass eye for seeing)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create an invisible sensor within range in a location familiar to you (a place you have visited or seen before) or in an obvious location that is unfamiliar to you (such as behind a door, around a corner, or in a grove of trees). The sensor remains in place for the duration, and it can\u2019t be attacked or otherwise interacted with.\n\nWhen you cast the spell, you choose seeing or hearing. You can use the chosen sense through the sensor as if you were in its space. As your action, you can switch between seeing and hearing.\n\nA creature that can see the sensor (such as a creature benefiting from *[see invisibility](../see-invisibility/ \"see invisibility (lvl 2)\")* or truesight) sees a luminous, intangible orb about the size of your fist.",
            "duration": "Concentration, up to 10 minutes",
            "level": "3",
            "name": "Clairvoyance",
            "range": "1 mile",
            "ritual": false,
            "school": "divination",
            "tags": [
                "bard",
                "cleric",
                "sorcerer",
                "wizard",
                "level3"
            ],
            "type": "3rd-level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a sliver of glass"
                ],
                "raw": "V, S, M (a sliver of glass)",
                "somatic": true,
                "verbal": true
            },
            "description": "You fill the air with spinning daggers in a cube 5 feet on each side, centered on a point you choose within range. A creature takes 4d4 slashing damage when it enters the spell\u2019s area for the first time on a turn or starts its turn there.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 2d4 for each slot level above 2nd.",
            "level": "2",
            "name": "Cloud of Daggers",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level2"
            ],
            "type": "2nd-level Conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Creatures of your choice that you can see within range and that can hear you must make a Wisdom saving throw. A target automatically succeeds on this saving throw if it can't be charmed. On a failed save, a target is affected by this spell. Until the spell ends, you can use a bonus action on each of your turns to designate a direction that is horizontal to you. Each affected target must use as much of its movement as possible to move in that direction on its next turn. It can take any action before it moves. After moving in this way, it can make another Wisdom save to try to end the effect.\n\nA target isn't compelled to move into an obviously deadly hazard, such as a fire or a pit, but it will provoke opportunity attacks to move in the designated direction.",
            "duration": "Concentration, up to 1 minute",
            "level": "4",
            "name": "Compulsion",
            "range": "30 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "level4"
            ],
            "type": "4th-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You summon fey spirits that take the form of beasts and appear in unoccupied spaces that you can see whithin range.  Choose one of the following options for what appears:\n\n* One beast of challenge rating 2 or lower\n\n* Two beasts of challenge rating 1 or lower\n\n* Four beasts of challenge rating 1/2 or lower\n\n* Eight beasts of challenge rating 1/4 or lower\n\nEach beast is also considered fey, and it disappears when it drops to 0 hit points or when the spell ends.\n\nThe summoned creatures are friendly to you and your companions. Roll initiative for the summoned creatures as a group, which has its own turns. They obey any verbal commands that you issue to them (no action required by you). If you don’t issue any commands to them, they defend themselves from hostile creatures, but otherwise take no actions.\n\nThe DM has the creatures’ statistics.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell using certain higher-level spell slots, you choose one of the summoning options above, and more creatures appear: twice as many with a 5th-level slot, three times as many with a 7th-level",
            "level": "3",
            "name": "Conjure Animals",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "ranger",
                "level3"
            ],
            "type": "3rd-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "one piece of ammunition or a thrown weapon"
                ],
                "raw": "V, S, M (one piece of ammunition or a thrown weapon)",
                "somatic": true,
                "verbal": true
            },
            "description": "You throw a nonmagical weapon or fire a piece of nonmagical ammunition into the air to create a cone of identical weapons that shoot forward and then disappear. Each creature in a 60-foot cone must succeed on a Dexterity saving throw. A creature takes 3d8 damage on a failed save, or half as much damage on a successful one. The damage type is the same as that of the weapon or ammunition used as a component.",
            "duration": "Instantaneous",
            "level": "3",
            "name": "Conjure Barrage",
            "range": "Self (60-foot cone)",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "ranger",
                "level3"
            ],
            "type": "3rd-level conjuration"
        },
        {
            "casting_time": "1 reaction, which you take when you see a creature within 60 feet of you casting a spell.",
            "classes": [
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "S",
                "somatic": true,
                "verbal": false
            },
            "description": "You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect. If it is casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell\u2019s level. On a success, the creature\u2019s spell fails and has no effect.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, the interrupted spell has no effect if its level is less than or equal to the level of the spell slot you used.",
            "level": "3",
            "name": "Counterspell",
            "range": "60 feet",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "sorcerer",
                "warlock",
                "wizard",
                "level3"
            ],
            "type": "3rd-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You create 45 pounds of food and 30 gallons of water on the ground or in containers within range, enough to sustain up to fifteen humanoids or five steeds for 24 hours. The food is bland but nourishing, and spoils if uneaten after 24 hours. The water is clean and doesn\u2019t go bad.",
            "duration": "Instantaneous",
            "level": "3",
            "name": "Create Food and Water",
            "range": "30 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "cleric",
                "paladin",
                "level3"
            ],
            "type": "3rd-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "Holy power radiates from you in an aura with a 30-foot radius, awakening boldness in friendly creatures. Until the spell ends, the aura moves with you, centered on you. While in the aura, each nonhostile creature in the aura (including you) deals an extra 1d4 radiant damage when it hits with a weapon attack.",
            "duration": "Concentration, up to 1 minute",
            "level": "3",
            "name": "Crusader's Mantle",
            "range": "Self",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "paladin",
                "level3"
            ],
            "type": "3rd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid",
                "paladin",
                "ranger",
                "sorcerer"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A 60-foot-radius sphere of light spreads out from a point you choose within range. The sphere is bright light and sheds dim light for an additional 60 feet.\n\nIf you chose a point on an object you are holding or one that isn\u2019t being worn or carried, the light shines from the object and moves with it. Completely covering the affected object with an opaque object, such as a bowl or a helm, blocks the light.\n\nIf any of this spell\u2019s area overlaps with an area of darkness created by a spell of 3rd level or lower, the spell that created the darkness is dispelled.",
            "duration": "1 hour",
            "level": "3",
            "name": "Daylight",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "cleric",
                "druid",
                "paladin",
                "ranger",
                "sorcerer",
                "level3"
            ],
            "type": "3rd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "druid",
                "paladin",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Choose one creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends. For each spell of 4th level or higher on the target, make an ability check using your spellcasting ability. The DC equals 10 + the spell\u2019s level. On a successful check, the spell ends.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, you automatically end the effects of a spell on the target if the spell\u2019s level is equal to or less than the level of the spell slot you used.",
            "level": "3",
            "name": "Dispel Magic",
            "range": "120 feet",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "paladin",
                "sorcerer",
                "warlock",
                "wizard",
                "level3"
            ],
            "type": "3rd-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A nonmagical weapon you touch becomes a magic weapon. Choose one of the following damage types: acid, cold, fire, lightning, or thunder. For the duration, the weapon has a +1 bonus to attack rolls and deals an extra 1d4 damage of the chosen type when it hits.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell using a spell slot of 5th or 6th level, the bonus to attack rolls increases to +2 and the extra damage increases to 2d4. When you use a spell slot of 7th level or higher, the bonus increases to +3 and the extra damage increases to 3d4.",
            "level": "3",
            "name": "Elemental Weapon",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "paladin",
                "level3"
            ],
            "type": "3rd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a white feather or the heart of a hen"
                ],
                "raw": "V, S, M (a white feather or the heart of a hen)",
                "somatic": true,
                "verbal": true
            },
            "description": "You project a phantasmal image of a creature\u2019s worst fears. Each creature in a 30-foot cone must succeed on a Wisdom saving throw or drop whatever it is holding and become frightened for the duration.\n\nWhile frightened by this spell, a creature must take the Dash action and move away from you by the safest available route on each of its turns, unless there is nowhere to move. If the creature ends its turn in a location where it doesn\u2019t have line of sight to you, the creature can make a Wisdom saving throw. On a successful save, the spell ends for that creature.",
            "duration": "Concentration, up to 1 minute",
            "level": "3",
            "name": "Fear",
            "range": "Self (30-foot cone)",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level3"
            ],
            "type": "3rd-level illusion"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "druid",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of graveyard dirt"
                ],
                "raw": "V, S, M (a pinch of graveyard dirt)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a willing creature and put it into a cataleptic state that is indistinguishable from death.\n\nFor the spell\u2019s duration, or until you use an action to touch the target and dismiss the spell, the target appears dead to all outward inspection and to spells used to determine the target\u2019s status. The target is blinded and incapacitated, and its speed drops to 0. The target has resistance to all damage except psychic damage. If the target is diseased or poisoned when you cast the spell, or becomes diseased or poisoned while under the spell\u2019s effect, the disease and poison have no effect until the spell ends.",
            "duration": "1 hour",
            "level": "3",
            "name": "Feign Death",
            "range": "Touch",
            "ritual": true,
            "school": "necromancy",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "wizard",
                "level3"
            ],
            "type": "3rd-level necromancy (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a tiny ball of bat guano and sulfur"
                ],
                "raw": "V, S, M (a tiny ball of bat guano and sulfur)",
                "somatic": true,
                "verbal": true
            },
            "description": "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.\n\nThe fire spreads around corners. It ignites flammable objects in the area that aren't being worn or carried.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.",
            "level": "3",
            "name": "Fireball",
            "range": "150 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "level3"
            ],
            "type": "3rd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a wing feather from any bird"
                ],
                "raw": "V, S, M (a wing feather from any bird)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a willing creature. The target gains a flying speed of 60 feet for the duration. When the spell ends, the target falls if it is still aloft, unless it can stop the fall.",
            "duration": "Concentration, up to 10 minutes",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, you can target one additional creature for each slot level above 3rd.",
            "level": "3",
            "name": "Fly",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "warlock",
                "wizard",
                "level3"
            ],
            "type": "3rd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of gauze and a wisp of smoke"
                ],
                "raw": "V, S, M (a bit of gauze and a wisp of smoke)",
                "somatic": true,
                "verbal": true
            },
            "description": "You transform a willing creature you touch, along with everything it\u2019s wearing and carrying, into a misty cloud for the duration. The spell ends if the creature drops to 0 hit points. An incorporeal creature isn\u2019t affected.\n\nWhile in this form, the target\u2019s only method of movement is a flying speed of 10 feet. The target can enter and occupy the space of another creature. The target has resistance to nonmagical damage, and it has advantage on Strength, Dexterity, and Constitution saving throws. The target can pass through small holes, narrow openings, and even mere cracks, though it treats liquids as though they were solid surfaces. The target can't fall and remains hovering in the air even when stunned or otherwise incapacitated.\n\nWhile in the form of a misty cloud, the target can\u2019t talk or manipulate objects, and any objects it w as carrying or holding can\u2019t be dropped, used, or otherwise interacted with. The target can\u2019t attack or cast spells.",
            "duration": "Concentration, up to 1 hour",
            "level": "3",
            "name": "Gaseous Form",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "warlock",
                "wizard",
                "level3"
            ],
            "type": "3rd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a shaving of licorice root"
                ],
                "raw": "V, S, M (a shaving of licorice root)",
                "somatic": true,
                "verbal": true
            },
            "description": "Choose a willing creature that you can see within range. Until the spell ends, the target\u2019s speed is doubled, it gains a +2 bonus to AC, it has advantage on Dexterity saving throws, and it gains an additional action on each of its turns. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action.\n\nWhen the spell ends, the target can\u2019t move or take actions until after its next turn, as a wave of lethargy sweeps over it.",
            "duration": "Concentration, up to 1 minute",
            "level": "3",
            "name": "Haste",
            "range": "30 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "wizard",
                "level3"
            ],
            "type": "3rd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a glowing stick of incense or a crystal vial filled with phosphorescent material"
                ],
                "raw": "S, M (a glowing stick of incense or a crystal vial filled with phosphorescent material)",
                "somatic": true,
                "verbal": false
            },
            "description": "You create a twisting pattern of colors that weaves through the air inside a 30-foot cube within range. The pattern appears for a moment and vanishes. Each creature in the area who sees the pattern must make a Wisdom saving throw. On a failed save, the creature becomes charmed for the duration. While charmed by this spell, the creature is incapacitated and has a speed of 0.\n\nThe spell ends for an affected creature if it takes any damage or if someone else uses an action to shake the creature out of its stupor.",
            "duration": "Concentration, up to 1 minute",
            "level": "3",
            "name": "Hypnotic Pattern",
            "range": "120 feet",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level3"
            ],
            "type": "3rd-level illusion"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "The next time you make a ranged w eapon attack during the spell\u2019s duration, the weapon\u2019s ammunition, or the weapon itself if it\u2019s a thrown weapon, transforms into a bolt of lightning. Make the attack roll as normal. The target takes 4d8 lightning damage on a hit, or half as much damage on a miss, instead of the weapon\u2019s normal damage.\n\nWhether you hit or miss, each creature within 10 feet of the target must make a Dexterity saving throw. Each of these creatures takes 2d8 lightning damage on a failed save, or half as much damage on a successful one.\n\nThe piece of ammunition or weapon then returns to its normal form.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, the damage for both effects of the spell increases by 1d8 for each slot level above 3rd.",
            "level": "3",
            "name": "Lightning Arrow",
            "range": "Self",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "ranger",
                "level3"
            ],
            "type": "3rd-level transmutation"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "cleric",
                "paladin",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "holy water or powdered silver and iron worth at least 100 gp, which the spell consumes"
                ],
                "raw": "V, S, M (holy water or powdered silver and iron worth at least 100 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a 10-foot-radius, 20-foot-tall cylinder of magical energy centered on a point on the ground that you can see within range. Glowing runes appear wherever the cylinder intersects with the floor or other surface.\n\nChoose one or more of the following types of creatures: celestials, elementals, fey, fiends, or undead. The circle affects a creature of the chosen type in the following ways:\n\n* The creature can’t willingly enter the cylinder by nonmagical means. If the creature tries to use teleportation or interplanar travel to do so, it must first succeed on a Charisma saving throw.\n\n* The creature has disadvantage on attack rolls against targets within the cylinder.\n\n* Targets within the cylinder can’t be charmed, frightened, or possessed by the creature.\n\nWhen you cast this spell, you can elect to cause its magic to operate in the reverse direction, preventing a creature of the specified type from leaving the cylinder and protecting targets outside it.",
            "duration": "1 hour",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, the duration increases by 1 hour for each slot level above 3rd.",
            "level": "3",
            "name": "Magic Circle",
            "range": "10 feet",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "paladin",
                "warlock",
                "wizard",
                "level3"
            ],
            "type": "3rd-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of fleece"
                ],
                "raw": "V, S, M (a bit of fleece)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 20-foot cube. The image appears at a spot that you can see within range and lasts for the duration. It seems completely real, including sounds, smells, and temperature appropriate to the thing depicted. You can\u2019t create sufficient heat or cold to cause damage, a sound loud enough to deal thunder damage or deafen a creature, or a smell that might sicken a creature (like a troglodyte\u2019s stench).\n\nAs long as you are within range o f the illusion, you can use your action to cause the image to move to any other spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image. For example, if you create an image o f a creature and move it, you can alter the image so that it appears to be walking. Similarly, you can cause the illusion to make different sounds at different times, even making it carry on a conversation, for example.\n\nPhysical interaction with the image reveals it to be an illusion, because things can pass through it. A creature that uses its action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image, and its other sensory qualities become faint to the creature.",
            "duration": "Concentration, up to 10 minutes",
            "higher_levels": "When you cast this spell using a spell slot o f 6th level or higher, the spell lasts until dispelled, without requiring your concentration.",
            "level": "3",
            "name": "Major Image",
            "range": "120 feet",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level3"
            ],
            "type": "3rd-level illusion"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "As you call out words of restoration, up to six creatures of your choice that you can see within range regain hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, the healing increases by 1d4 for each slot level above 3rd.",
            "level": "3",
            "name": "Mass Healing Word",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "cleric",
                "level3"
            ],
            "type": "3rd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You assume a different form. When you cast the spell, choose one of the following options, the effects of which last for the duration of the spell. While the spell lasts, you can end one option as an action to gain the benefits of a different one.\n\n* Aquatic Adaptation: You adapt your body to an aquatic Environment, sprouting gills, and growing webbing between your fingers. You can breathe Underwater and gain a Swimming speed equal to your walking speed.\n\n* Change Appearance: You transform your Appearance. You decide what you look like, including your height, weight, facial features, sound of your voice, hair length, coloration, and distinguishing Characteristics, if any. You can make yourself appear as a member of another race, though none of your Statistics change. You also don't appear as a creature of a different size than you, and your basic shape stays the same, if you're bipedal, you can't use this spell to become quadrupedal, for instance. At any time for the Duration of the spell, you can use your action to change your Appearance in this way again.\n\n* Natural Weapons: You grow claws, fangs, spines, horns, or a different natural weapon of your choice. Your unarmed strikes deal 1d6 bludgeoning, piercing, or slashing damage, as appropriate to the natural weapon you chose, and you are proficient with your unarmed strikes. Finally, the natural weapon is magic and you have a +1 bonus to the Attack and Damage Rolls you make using it.",
            "duration": "Concentration, up to 1 hour",
            "level": "2",
            "name": "Alter Self",
            "range": "Self",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "wizard",
                "level2"
            ],
            "type": "2nd-Level Transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "gold dust w orth at least 25 gp, which the spell consumes"
                ],
                "raw": "V, S, M (gold dust w orth at least 25 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a closed door, window, gate, chest, or other entryway, and it becomes locked for the duration. You and the creatures you designate when you cast this spell can open the object normally. You can also set a password that, when spoken within 5 feet of the object, suppresses this spell for 1 minute. Otherwise, it is impassable until it is broken or the spell is dispelled or suppressed. Casting knock on the object suppresses arcane lock for 10 minutes.\n\nWhile affected by this spell, the object is more difficult to break or force open; the DC to break it or pick any locks on it increases by 10.",
            "duration": "Until dispelled",
            "level": "2",
            "name": "Arcane Lock",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "wizard",
                "level2"
            ],
            "type": "2nd-Level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a handful of oak bark"
                ],
                "raw": "V, S, M (a handful of oak bark)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a willing creature. Until the spell ends, the target\u2019s skin has a rough, bark-like appearance, and the target\u2019s AC can\u2019t be less than 16, regardless of what kind of armor it is wearing.",
            "duration": "Concentration, up to 1 hour",
            "level": "2",
            "name": "Barkskin",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "ranger",
                "level2"
            ],
            "type": "2nd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "ranger",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of diamond dust worth 25 gp sprinkled over the target, which the spell consumes"
                ],
                "raw": "V, S, M (a pinch of diamond dust worth 25 gp sprinkled over the target, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "For the duration, you hide a target that you touch from divination magic. The target can be a willing creature or a place or an object no larger than 10 feet in any dimension. The target can\u2019t be targeted by any divination magic or perceived through magical scrying sensors.",
            "duration": "8 hours",
            "level": "3",
            "name": "Nondetection",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "bard",
                "ranger",
                "wizard",
                "level3"
            ],
            "type": "3rd-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You step into a stone object or surface large enough tofully contain your body, melding yourself and all the equipment you carry with the stone for the duration. Using your movement, you step into the stone at a point you can touch. Nothing of your presence remains visible or otherwise detectable by nonmagical senses.\n\nWhile merged with the stone, you can\u2019t see what occurs outside it, and any Wisdom (Perception) checks you make to hear sounds outside it are made with disadvantage. You remain aware of the passage of time and can cast spells on yourself while merged in the stone. You can use your movement to leave the stone where you entered it, which ends the spell. You otherwise can\u2019t move.\n\nMinor physical damage to the stone doesn\u2019t harm you, but its partial destruction or a change in its shape (to the extent that you no longer fit w ithin it) expels you and deals 6d6 bludgeoning damage to you. The stone\u2019s complete destruction (or transmutation into a different substance) expels you and deals 50 bludgeoning damage to you. If expelled, you fall prone in an unoccupied space closest to where you first entered.",
            "duration": "8 hours",
            "level": "3",
            "name": "Meld into Stone",
            "range": "Touch",
            "ritual": true,
            "school": "transmutation",
            "tags": [
                "cleric",
                "druid",
                "level3"
            ],
            "type": "3rd-level transmutation (ritual)"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A Large quasi-real, horselike creature appears on the ground in an unoccupied space of your choice within range. You decide the creature\u2019s appearance, but it is equipped with a saddle, bit, and bridle. Any of the equipment created by the spell vanishes in a puff of smoke if it is carried more than 10 feet away from the steed.\n\nFor the duration, you or a creature you choose can ride the steed. The creature uses the statistics for a riding horse, except it has a speed of 100 feet and can travel 10 miles in an hour, or 13 miles at a fast pace. When the spell ends, the steed gradually fades, giving the rider 1 minute to dismount. The spell ends if you use an action to dismiss it or if the steed takes any damage.",
            "duration": "1 hour",
            "level": "3",
            "name": "Phantom Steed",
            "range": "30 feet",
            "ritual": true,
            "school": "illusion",
            "tags": [
                "wizard",
                "level3"
            ],
            "type": "3rd-level illusion (ritual)"
        },
        {
            "casting_time": "1 action or 8 hours",
            "classes": [
                "bard",
                "druid",
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell channels vitality into plants within a specific area. There are two possible uses for the spell, granting either immediate or long-term benefits.\n\nIf you cast this spell using 1 action, choose a point within range. All normal plants in a 100-foot radius centered on that point become thick and overgrown. A creature moving through the area must spend 4 feet of movement for every 1 foot it moves.\n\nYou can exclude one or more areas of any size within the spell\u2019s area from being affected.\n\nIf you cast this spell over 8 hours, you enrich the land. All plants in a half-mile radius centered on a point within range become enriched for 1 year. The plants yield twice the normal amount of food when harvested.",
            "duration": "Instantaneous",
            "level": "3",
            "name": "Plant Growth",
            "range": "150 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "druid",
                "ranger",
                "level3"
            ],
            "type": "3rd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid",
                "ranger",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "For the duration, the willing creature you touch has resistance to one damage type of your choice: acid, cold, fire, lightning, or thunder.",
            "duration": "Concentration, up to 1 minute",
            "level": "3",
            "name": "Protection from Energy",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "druid",
                "ranger",
                "sorcerer",
                "wizard",
                "level3"
            ],
            "type": "3rd-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "paladin"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "diamonds worth 300 gp, which the spell consumes"
                ],
                "raw": "V, S, M (diamonds worth 300 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a creature that has died within the last minute. That creature returns to life with 1 hit point. This spell can\u2019t return to life a creature that has died of old age, nor can it restore any missing body parts.",
            "duration": "Instantaneous",
            "level": "3",
            "name": "Revivify",
            "range": "Touch",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "cleric",
                "paladin",
                "level3"
            ],
            "type": "3rd-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a short piece of fine copper wire"
                ],
                "raw": "V, S, M (a short piece of fine copper wire)",
                "somatic": true,
                "verbal": true
            },
            "description": "You send a short message of twenty-five words or less to a creature with which you are familiar. The creature hears the message in its mind, recognizes you as the sender if it knows you, and can answer in a like manner immediately. The spell enables creatures with Intelligence scores of at least 1 to understand the meaning of your message.\n\nYou can send the message across any distance and even to other planes of existence, but if the target is on a different plane than you, there is a 5 percent chance that the message doesn\u2019t arrive.",
            "duration": "1 round",
            "level": "3",
            "name": "Sending",
            "range": "Unlimited",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "bard",
                "cleric",
                "wizard",
                "level3"
            ],
            "type": "3rd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of dust and a few drops of water"
                ],
                "raw": "V, S, M (a pinch of dust and a few drops of water)",
                "somatic": true,
                "verbal": true
            },
            "description": "Until the spell ends, freezing rain and sleet fall in a 20-foot-tall cylinder with a 40-foot radius centered on a point you choose within range. The area is heavily obscured, and exposed flames in the area are doused.\n\nThe ground in the area is covered with slick ice, making it difficult terrain. When a creature enters the spell\u2019s area for the first time on a turn or starts its turn there, it must make a Dexterity saving throw. On a failed save, it falls prone.\n\nIf a creature is concentrating in the spell\u2019s area, the creature must make a successful Constitution saving throw against your spell save DC or lose concentration.",
            "duration": "Concentration, up to 1 minute",
            "level": "3",
            "name": "Sleet Storm",
            "range": "150 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "level3"
            ],
            "type": "3rd-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a drop of molasses"
                ],
                "raw": "V, S, M (a drop of molasses)",
                "somatic": true,
                "verbal": true
            },
            "description": "You alter time around up to six creatures of your choice in a 40-foot cube within range. Each target must succeed on a wisdom saving throwor be affected by this spell for the duration.\n\nAn affected target\u2019s speed is halved, it takes a -2 penalty to AC and Dexterity saving throws, and it can\u2019t use reactions. On its turn, it can use either an action or a bonus action, not both. Regardless of the creature\u2019s abilities or magic items, it can\u2019t make more than one melee or ranged attack during its turn.\n\nIf the creature attempts to cast a spell with a casting time of 1 action, roll a d20. On an 11 or higher, the spell doesn\u2019t take effect until the creature\u2019s next turn, and the creature must use its action on that turn to complete the spell. If it can\u2019t, the spell is wasted.\n\nA creature affected by this spell makes another Wisdom saving throwat the end of its turn. On a successful save, the effect ends for it.",
            "duration": "Concentration, up to 1 minute",
            "level": "3",
            "name": "Slow",
            "range": "120 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "wizard",
                "level3"
            ],
            "type": "3rd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "burning incense"
                ],
                "raw": "V, S, M (burning incense)",
                "somatic": true,
                "verbal": true
            },
            "description": "You grant the semblance o f life and intelligence to a corpse of your choice within range, allowing it to answer the questions you pose. The corpse must still have a mouth and can\u2019t be undead. The spell fails if the corpse was the target o f this spell within the last 10 days.\n\nUntil the spell ends, you can ask the corpse up to five questions. The corpse knows only what it knew in life, including the languages it knew. Answers are usually brief, cryptic, or repetitive, and the corpse is under no compulsion to offer a truthful answer if you are hostile to it or it recognizes you as an enemy. This spell doesn\u2019t return the creature\u2019s soul to its body, only its animating spirit. Thus, the corpse can\u2019t learn new information, doesn\u2019t comprehend anything that has happened since it died, and can\u2019t speculate about future events.",
            "duration": "10 minutes",
            "level": "3",
            "name": "Speak with Dead",
            "range": "10 feet",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "bard",
                "cleric",
                "level3"
            ],
            "type": "3rd-level necromancy"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You imbue plants within 30 feet of you with limited sentience and animation, giving them the ability to communicate with you and follow your simple commands. You can question plants about events in the spell\u2019s area within the past day, gaining information about creatures that have passed, weather, and other circumstances.\n\nYou can also turn difficult terrain caused by plant growth (such as thickets and undergrowth) into ordinary terrain that lasts for the duration. Or you can turn ordinary terrain where plants are present into difficult terrain that lasts for the duration, causing v ines and branches to hinder pursuers, for example.\n\nPlants might be able to perform other tasks on your behalf, at the DM\u2019s discretion. The spell doesn\u2019t enable plants to uproot themselves and move about, but they can freely move branches, tendrils, and stalks.\n\nIf a plant creature is in the area, you can communicate with it as if you shared a common language, but you gain no magical ability to influence it.\n\nThis spell can cause the plants created by the entangle spell to release a restrained creature.",
            "duration": "10 minutes",
            "level": "3",
            "name": "Speak with Plants",
            "range": "Self (30-foot radius",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "druid",
                "ranger",
                "level3"
            ],
            "type": "3rd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a holy symbol"
                ],
                "raw": "V, S, M (a holy symbol)",
                "somatic": true,
                "verbal": true
            },
            "description": "You call forth spirits to protect you. They flit around you to a distance of 15 feet for the duration. If you are good or neutral, their spectral form appears angelic or fey (your choice). If you are evil, they appear fiendish.\n\nWhen you cast this spell, you can designate any number of creatures you can see to be unaffected by it. An affected creature\u2019s speed is halved in the area, and when the creature enters the area for the first time on a turn or starts its turn there, it must make a Wisdom saving throw. On a failed save, the creature takes 3d8 radiant damage (if you are good or neutral) or 3d8 necrotic damage (if you are evil). On a successful save, the creature takes half as much damage.",
            "duration": "Concentration, up to 10 minutes",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.",
            "level": "3",
            "name": "Spirit Guardians",
            "range": "Self (15-foot radius)",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "cleric",
                "level3"
            ],
            "type": "3rd-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a rotten egg or several skunk cabbage leaves"
                ],
                "raw": "V, S, M (a rotten egg or several skunk cabbage leaves)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a 20-foot-radius sphere of yellow, nauseating gas centered on a point within range. The cloud spreads around corners, and its area is heavily obscured. The cloud lingers in the air for the duration.\n\nEach creature that is completely within the cloud at the start of its turn must make a Constitution saving throw against poison. On a failed save, the creature spends its action that turn retching and reeling. Creatures that don\u2019t need to breathe or are immune to poison automatically succeed on this saving throw.\n\nA moderate wind (at least 10 miles per hour) disperses the cloud after 4 rounds. A strong wind (at least 20 miles per hour) disperses it after 1 round.",
            "duration": "Concentration, up to 1 minute",
            "level": "3",
            "name": "Stinking Cloud",
            "range": "90 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "level3"
            ],
            "type": "3rd-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "three nut shells"
                ],
                "raw": "V, S, M (three nut shells)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell assaults and twists creatures' minds, spawning delusions and provoking uncontrolled action. Each creature in a 10-foot radius sphere centered on a point you choose within range must succeed on a Wisdom saving throw when you cast this spell or by affected by it.\n\nAn affected target can't take reactions and must roll a d10 at the start of each of its turns to determine its behaviour for that turn.\n\n1: The creature uses all its Movement to move in a random direction. To determine the direction, roll a d8 and assign a direction to each die face. The creature doesn't take an action this turn.\n2-6: The creature doesn't move or take Actions this turn.\n7-8: The creature uses its action to make a melee Attack against a randomly determined creature within its reach. If there is no creature within its reach, the creature does nothing this turn.\n9-10: The creature can act and move normally.\n\nAt the end of each of its turns, an affected target can make a Wisdom saving throw. If it succeeds, this effect ends for that target",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 5th level or higher, the radius of the sphere increases by 5 feet for each spell slot above 4th.",
            "level": "4",
            "name": "Confusion",
            "range": "90 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "druid",
                "sorcerer",
                "wizard",
                "level4"
            ],
            "type": "4th-level enchantment"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "druid",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You summon elementals that appear in unoccupied spaces that you can see within range. You choose one of the following options for what appears:\n\n* One elemental of challenge rating 2 or lower\n\n* Two elementals of challenge rating 1 or lower\n\n* Four elementals of challenge rating 1/2 or lower\n\n* Eight elementals of challenge rating 1/4 or lower.\n\nAn elemental summoned by this spell disappears when it drops to 0 hit points or when the spell ends.\n\nThe summoned creatures are friendly to you and your companions. Roll initiative for the summoned creatures as a group, which has its own turns. They obey any verbal commands that you issue to them (no action required by you). If you don't issue any commands to them, they defend themselves from hostile creatures, but otherwise take no actions.\n\nThe DM has the creatures' statistics.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell using certain higher-level slots, you choose one of the summoning options above, and more creatures appear: twice as many with a 6th-level slot and three times as many with an 8th-level slot.",
            "level": "4",
            "name": "Conjure Minor Elementals",
            "range": "90 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "wizard",
                "level4"
            ],
            "type": "4th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a drop of water and a pinch of dust"
                ],
                "raw": "V, S, M (a drop of water and a pinch of dust)",
                "somatic": true,
                "verbal": true
            },
            "description": "Until the spell ends, you control any freestanding water inside an area you choose that is a cube up to 100 feet on a side. You can choose from any of the following effects when you cast this spell. As an action on your turn, you can repeat the same effect or choose a different one.\n\nFlood: You cause the water level of all standing water in the area to rise by as much as 20 feet. If the area includes a shore, the flooding water spills over onto dry land. If you choose an area in a large body of water, you instead create a 20-foot tall wave that travels from one side of the area to the other and then crashes down. Any Huge or smaller vehicles in the wave's path are carried with it to the other side. Any Huge or smaller vehicles struck by the wave have a 25 percent chance of capsizing. The water level remains elevated until the spell ends or you choose a different Effect. If this Effect produced a wave, the wave repeats on the start of your next turn while the flood Effect lasts.\n\nPart Water: You cause water in the area to move apart and create a Trench. The Trench extends across the spell's area, and the separated water forms a wall to either side. The Trench remains until the spell ends or you choose a different Effect. The water then slowly fills in the Trench over the course of the next round until the normal water level is restored.\n\nRedirect Flow: You cause flowing water in the area to move in a direction you choose, even if the water has to flow over Obstacles, up walls, or in other unlikely Directions. The water in the area moves as you direct it, but once it moves beyond the spell's area, it resumes its flow based on the terrain Conditions. The water continues to move in the direction you chose until the spell ends or you choose a different Effect.\n\nWhirlpool: This Effect requires a body of water at least 50 feet square and 25 feet deep. You cause a whirlpool to form in the center of the area. The whirlpool forms a vortex that is 5 feet wide at the base, up to 50 feet wide at the top, and 25 feet tall. Any creature or object in the water and within 25 feet of the vortex is pulled 10 feet toward it. A creature can swim away from the vortex by making a Strength (Athletics) check against your spell save DC. When a creature enters the vortex for the first time on a turn or starts its turn there, it must make a Strength saving throw. On a failed save, the creature takes 2d8 bludgeoning damage and is caught in the vortex until the spell ends. On a successful save, the creature takes half damage, and isn't caught in the vortex. A creature caught in the vortex can use its action to try to swim away from the vortex as described above, but has disadvantage on the Strength (Athletics) check to do so. The first time each turn that an object enters the vortex, the object takes 2d8 bludgeoning damage, this damage occurs each round it remains in the vortex.",
            "duration": "Concentration, up to 10 minutes",
            "level": "4",
            "name": "Control Water",
            "range": "300 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "cleric",
                "druid",
                "wizard",
                "level4"
            ],
            "type": "4th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "one holly berry per creature summoned"
                ],
                "raw": "V, S, M (one holly berry per creature summoned)",
                "somatic": true,
                "verbal": true
            },
            "description": "You summon fey creatures that appear in unoccupied spaces that  you can see within range.  Choose one of the following options for what appears:\n\n* One fey creature of challenge rating 2 or lower\n\n* Two fey creatures of challenge rating 1 or lower\n\n* Four fey creatures of challenge rating 1/2 or lower\n\n* Eight fey creatures of challenge rating 1/4 or lower\n\nA summoned creature disappears when it drops to 0 hit points or when the spell ends.\n\nThe summoned creatures are friendly to you and your companions. Roll initiative for the summoned creatures as a group, which have their own turns. They obey any verbal commands that you issue to them (no action required by you). If you don't issue any commands to them, they defend themselves from hostile creatures, but otherwise take no actions.\n\nThe DM has the creatures' statistics.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell using certain higher-level spell slots, you choose one of the summoning options above, and more creatures appear: twice as many with a 6th-level slot and three times as many with an 8th-level slot.",
            "level": "4",
            "name": "Conjure Woodland Beings",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "ranger",
                "level4"
            ],
            "type": "4th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a creature and grant it a measure of protection from death.\n\nThe first time the target would drop to 0 hit points as a result of taking damage, the target instead drops to 1 hit point, and the spell ends.\n\nIf the spell is still in effect when the target is subjected to an effect that would kill it instantaneously without dealing damage, that effect is instead negated against the target, and the spell ends.",
            "duration": "8 hours",
            "level": "4",
            "name": "Death Ward",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "paladin",
                "level4"
            ],
            "type": "4th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a small clay model of a ziggurat"
                ],
                "raw": "V, M (a small clay model of a ziggurat)",
                "somatic": false,
                "verbal": true
            },
            "description": "This spell grants the creature you touch the ability to understand any spoken language it hears. Moreover, when the target speaks, any creature that knows at least one language and can hear the target understands what it says.",
            "duration": "1 hour",
            "level": "3",
            "name": "Tongues",
            "range": "Touch",
            "ritual": false,
            "school": "divination",
            "tags": [
                "bard",
                "cleric",
                "sorcerer",
                "warlock",
                "wizard",
                "level3"
            ],
            "type": "3rd-level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "S",
                "somatic": true,
                "verbal": false
            },
            "description": "You touch a willing beast. For the duration of the spell, you can use your action to see through the beast\u2019s eyes and hear what it hears, and continue to do so until you use your action to return to your normal senses.\n\nWhile perceiving through the beast\u2019s senses, you gain the benefits of any special senses possessed by that creature, though you are blinded and deafened to your own surroundings.",
            "duration": "Concentration, up to 1 hour",
            "level": "2",
            "name": "Beast Sense",
            "range": "Touch",
            "ritual": true,
            "school": "divination",
            "tags": [
                "druid",
                "ranger",
                "level2"
            ],
            "type": "2nd-level divination (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "Your body becomes blurred, shifting and wavering to all who can see you. For the duration, any creature has disadvantage on attack rolls against you. An attacker is immune to this effect if it doesn\u2019t rely on sight, as with blindsight, or can see through illusions, as with truesight.",
            "duration": "Concentration, up to 1 minute",
            "level": "2",
            "name": "Blur",
            "range": "Self",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "sorcerer",
                "wizard",
                "level2"
            ],
            "type": "2nd-Level illusion"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "The next time you hit a creature with a weapon attack before this spell ends, the weapon gleams with astral radiance as you strike. The attack deals an extra 2d6 radiant damage to the target, which becomes visible if it\u2019s invisible, and the target sheds dim light in a 5-foot radius and can\u2019t become invisible until the spell ends.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, the extra damage increases by 1d6 for each slot level above 2nd.",
            "level": "2",
            "name": "Branding Smite",
            "range": "Self",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "paladin",
                "level2"
            ],
            "type": "2nd-Level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "four or more arrows or bolts"
                ],
                "raw": "V, S, M (four or more arrows or bolts)",
                "somatic": true,
                "verbal": true
            },
            "description": "You plant four pieces of nonmagical ammunition\u2014arrows or crossbow bolts\u2014in the ground within range and lay magic upon them to protect an area. Until the spell ends, whenever a creature other than you comes within 30 feet of the ammunition for the first time on a turn or ends its turn there, one piece of ammunition flies up to strike it. The creature must succeed on a Dexterity saving throw or take 1d6 piercing damage. The piece of ammunition is then destroyed. The spell ends when no ammunition remains.\n\nWhen you cast this spell, you can designate any creatures you choose, and the spell ignores them.",
            "duration": "8 hours",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, the amount of ammunition that can be affected increases by two for each slot level above 2nd.",
            "level": "2",
            "name": "Cordon Of Arrows",
            "range": "5 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "ranger",
                "level2"
            ],
            "type": "2nd-Level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "One humanoid of your choice that you can see within range must succeed on a Wisdom saving throw or become charmed by you for the duration. While the target is charmed in this way, a twisted crown of jagged iron appears on its head, and a madness glows in its eyes.\nThe charmed target must use its action before moving on each of its turns to make a melee attack against a creature other than itself that you mentally choose.\nThe target can act normally on its turn if you choose no creature or if none are within its reach.\nOn your subsequent turns, you must use your action to maintain control over the target, or the spell ends. Also, the target can make a Wisdom saving throw at the end of each of its turns. On a success, the spell ends.",
            "duration": "Concentration, up to 1 minute",
            "level": "2",
            "name": "Crown of Madness",
            "range": "120 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level2"
            ],
            "type": "2nd-Level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "bat fur and a drop of pitch or piece of coal"
                ],
                "raw": "V, M (bat fur and a drop of pitch or piece of coal)",
                "somatic": false,
                "verbal": true
            },
            "description": "Magical darkness spreads from a point you choose within range to fill a 15-foot-radius sphere for the duration. The darkness spreads around corners. A creature with darkvision can\u2019t see through this darkness, and nonmagical light can\u2019t illuminate it. If the point you choose is on an object you are holding or one that isn\u2019t being worn or carried, the darkness emanates from the object and moves with it. Completely covering the source of the darkness with an opaque object, such as a bowl or a helm, blocks the darkness. If any of this spell\u2019s area overlaps with an area of light created by a spell of 2nd level or lower, the spell that created the light is dispelled.",
            "duration": "Concentration, up to 10 minutes",
            "level": "2",
            "name": "Darkness",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "warlock",
                "wizard",
                "level2"
            ],
            "type": "2nd-Level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "either a pinch of dried carrot or an agate"
                ],
                "raw": "V, S, M (either a pinch of dried carrot or an agate)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a willing creature to grant it the ability to see in the dark. For the duration, that creature has darkvision out to a range of 60 feet.",
            "duration": "8 hours",
            "level": "2",
            "name": "Darkvision",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "ranger",
                "sorcerer",
                "wizard",
                "level2"
            ],
            "type": "2nd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a copper piece"
                ],
                "raw": "V, S, M (a copper piece)",
                "somatic": true,
                "verbal": true
            },
            "description": "For the duration, you can read the thoughts of certain creatures. When you cast the spell and as your action on each turn until the spell ends, you can focus your mind on any one creature that you can see within 30 feet of you. If the creature you choose has an Intelligence of 3 or lower or doesn\u2019t speak any language, the creature is unaffected.\n\nYou initially learn the surface thoughts of the creature\u2014what is most on its mind in that moment. As an action, you can either shift your attention to another creature\u2019s thoughts or attempt to probe deeper into the same creature\u2019s mind. If you probe deeper, the target must make a Wisdom saving throw. If it fails, you gain insight into its reasoning (if any), its emotional state, and something that looms large in its mind (such as something it worries over, loves, or hates). If it succeeds, the spell ends. Either way, the target knows that you are probing into its mind, and unless you shift your attention to another creature\u2019s thoughts, the creature can use its action on its turn to make an Intelligence check contested by your Intelligence check; if it succeeds, the spell ends.\n\nQuestions verbally directed at the target creature naturally shape the course of its thoughts, so this spell is particularly effective as part of an interrogation. You can also use this spell to detect the presence of thinking creatures you can\u2019t see. When you cast the spell or as your action during the duration, you can search for thoughts within 30 feet of you. The spell can penetrate barriers, but 2 feet of rock, 2 inches of any metal other than lead, or a thin sheet of lead blocks you. You can\u2019t detect a creature with an Intelligence of 3 or lower or one that doesn\u2019t speak any language.\n\nOnce you detect the presence of a creature in this way, you can read its thoughts for the rest of the duration as described above, even if you can\u2019t see it, but it must still be within range.",
            "duration": "Concentration, up to 1 minute",
            "level": "2",
            "name": "Detect Thoughts",
            "range": "Self",
            "ritual": false,
            "school": "divination",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "level2"
            ],
            "type": "2nd-Level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Your magic turns others into beasts. Choose any number of willing creatures that you can see within range. You transform each target into the form of a Large or smaller beast with a challenge rationg of 4 or lower.  On subsequent turns, you can use your action to transform affected creatures into new forms.\n\nThe transformation lasts for the duration for each target, or until the target drops to 0 hit points or dies.  You can choose a different form for each target. A target's game statistics are replaced by the statistics of the chosen beast, thought the target retains its alignment and Intelligence, Wisdom, and Charisma scores. The target assumes the hit points of its new form, and when it reverts to its normal form, it returns to the number of hit points it had before it transformed. If it reverts as a result of dropping to 0 hit points, any excess damage carries over to its normal form. As long as the excess damage doesn't reduce the creature's normal form to 0 hit points, it isn't knocked unconscious. The creature is limited in the actions it can perform by the nature of its new form, and it can't speak or cast spells.\n\nThe target's gear melds into the new form. The target can't activate, wield, or otherwise benefit from any of its equipment.",
            "duration": "Concentration, up to 24 hours",
            "level": "8",
            "name": "Animal Shapes",
            "range": "30 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "level8"
            ],
            "type": "8th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of powdered iron or iron filings"
                ],
                "raw": "V, S, M (a pinch of powdered iron or iron filings)",
                "somatic": true,
                "verbal": true
            },
            "description": "A 10-foot-radius Invisible Sphere of antimagic surrounds you. This area is divorced from the magical energy that suffuses the multiverse. Within the Sphere, Spells can't be cast, summoned creatures disappear, and even Magic Items become mundane. Until the spell ends, the Sphere moves with you, centered on you.\nSpells and other magical Effects, except those created by an artifact or a deity, are suppressed in the Sphere and can't protrude into it. A slot expended to cast a suppressed spell is consumed. While an Effect is suppressed, it doesn't function, but the time it spends suppressed counts against its Duration.\n\n* Targeted Effects: Spells and other magical Effects, such as Magic Missile and Charm Person, that target a creature or an object in the Sphere have no Effect on that target.\n* Areas of Magic: The area of another spell or magical Effect, such as Fireball, can't extend into the Sphere. If the Sphere overlaps an area of magic, the part of the area that is covered by the Sphere is suppressed. For example, the flames created by a Wall of Fire are suppressed within the Sphere, creating a gap in the wall if the overlap is large enough.\n* Spells: Any active spell or other magical Effect on a creature or an object in the Sphere is suppressed while the creature or object is in it.\n* Magic Items: The Properties and powers of Magic Items are suppressed in the Sphere. For example, a +1 long sword in the Sphere functions as a nonmagical long sword. A magic weapon's Properties and powers are suppressed if it is used against a target in the Sphere or wielded by an attacker in the Sphere. If a Magic Weapon or piece of magic Ammunition fully leaves the Sphere (For example, if you fire a Magic Arrow or throw a magic spear at a target outside the sphere), the magic of the item ceases to be suppressed as soon as it exits.\n* Magical Travel: Teleportation and Planar Travel fail to work in the Sphere, whether the Sphere is the destination or the departure point for such magical Travel. A portal to another location, world, or plane of existence, as well as an opening to an extradimensional space such as that created by the Rope Trick Spells, temporarily closes while in the Sphere.\n* Creatures and Objects: A creature or object summoned or created by magic temporarily winks out of existence in the Sphere. Such a creature instantly reappears once the space the creature occupied is no longer within the Sphere.\n* Dispel Magic: Spells and magical Effects such as Dispel Magic have no Effect on the Sphere. Likewise, the spheres created by different antimagic field Spells don't nullify each other.",
            "duration": "Concentration, up to 1 hour",
            "level": "8",
            "name": "Antimagic Field",
            "range": "Self (10-foot-radius sphere)",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "wizard",
                "level8"
            ],
            "type": "8th-level abjuration"
        },
        {
            "casting_time": "1 hour",
            "classes": [
                "druid",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "either a hump of alum soaked in vinegar for the _antipathy_ effect or a drop of honey for the _sympathy_ effect"
                ],
                "raw": "V, S, M (either a hump of alum soaked in vinegar for the _antipathy_ effect or a drop of honey for the _sympathy_ effect)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell attracts or repels creatures of your choice. You target something within range, either a Huge or smaller object or creature or an area that is no larger than a 200-foot cube. Then specify a kind of intelligent creature, such as Red Dragons, Goblins, or vampires. You invest the target with an aura that either attracts or repels the specified creatures for the Duration. Choose antipathy or sympathy as the aura's Effect.\n\n* Antipathy. The Enchantment causes creatures of the kind you designated to feel an intense urge to leave the area and avoid the target. When such a creature can see the target or comes within 60 feet of it, the creature must succeed on a Wisdom saving throw or become Frightened. The creature remains frigh⁠tened while it can see the target or is within 60 feet of it. While frig⁠htened by the target, the creature must use its Movement to move to the nearest safe spot from which it can't see the target. If the creature moves more than 60 feet from the target and can't see it, the creature is no longer fright⁠ened, but the creature becomes fright⁠ened again if it regains sight of the target or moves within 60 feet of it.\n\n* Sympathy. The Enchantment causes the specified creatures to feel an intense urge to approach the target while within 60 feet of it or able to see it. When such a creature can see the target or comes within 60 feet of it, the creature must succeed on a Wisdom saving throw or use its Movement on each of its turns to enter the area or move within reach of the target. When the creature has done so, it can't willingly move away from the target. If the target damages or otherwise harms an affected creature, the affected creature can make a Wisdom saving throw to end the Effect, as described below.\n\n* Ending the Effect. If an affected creature ends its turn while not within 60 feet of the target or able to see it, the creature makes a Wisdom saving throw. ON a successful save, the creature is no longer affected by the target and recognizes the feeling of repugnance or attraction as magical. In addition, a creature affected by the Spells is allowed another Wisdom saving throw every 24 hours while the spell persists.\n\nA creature that successfully saves against this Effect is immune to it for 1 minute, after which time it can be affected again.",
            "duration": "10 days",
            "level": "8",
            "name": "Antipathy/Sympathy",
            "range": "60 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "druid",
                "wizard",
                "level8"
            ],
            "type": "8th-level enchantment"
        },
        {
            "casting_time": "1 hour",
            "classes": [
                "cleric",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "for each creature you affect with this spell you must provide one jacinth worth at least 1,000 gp and one ornately carved bar of silver worth at least 100gp, all of which the spell consumes"
                ],
                "raw": "V, S, M (for each creature you affect with this spell you must provide one jacinth worth at least 1,000 gp and one ornately carved bar of silver worth at least 100gp, all of which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "You and up to eight willing creatures within range project your astral bodies into the Astral Plane (the spell fails and the casting is wasted if you are already on that plane). The material body you leave behind is unconscious and in a state of suspended animation; it doesn't need food or air and doesn't age.\n\nYour astral body resembles your mortal form in almost every way, replicating your game statistics and possessions. The principal difference is the addition of a silvery cord that extends from between your shoulder blades and trails behind you, fading to invisibility after 1 foot. This cord is your tether to your material body. As long as the tether remains intact, you can find your way home. If the cord is cut--something that can happen only when an effect specifically states that it does--your soul and body are separated, killing you instantly.\n\nYour astral form can freely travel through the Astral Plane and can pass through portals there leading to any other plane. If you enter a new plane or return to the plane you were on when casting this spell, your body and possessions are transported along the silver cord, allowing you to re-enter your body as you enter the new plane. Your astral form is a separate incarnation. Any damage or other effects that apply to it have no effect on your physical body, nor do they persist when you return to it.\n\nThe spell ends for you and your companions when you use your action to dismiss it. When the spell ends, the affected creature returns to its physical body, and it awakens.\n\nThe spell might also end early for you or one of your companions. A successful _dispel magic_ spell used against an astral or physical body ends the spell for that creature. If a creature's original body or its astral form drops to 0 hit points, the spell ends for that creature. If the spell ends and the silver cord is intact, the cord pulls the creature's astral form back to its body, ending its state of suspended animation.\n\nIf you are returned to your body prematurely, your companions remain in their astral forms and must find their own way back to their bodies, usually by dropping to 0 hit points.",
            "duration": "Special",
            "level": "9",
            "name": "Astral Projection",
            "range": "10 feet",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "cleric",
                "warlock",
                "wizard",
                "level9"
            ],
            "type": "9th-level necromancy"
        },
        {
            "casting_time": "1 hour",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a diamond worth at least 1,000 gp and at least 1 cubic inch of flesh of the creature that is to be cloned, which the spell consumes, and a vessel worth at least 2,000 gp that has a sealable lid and is large enough to hold a medium creature, such as a large urn, coffin, mud-filled cyst in the ground, or crystal container filled with salt water"
                ],
                "raw": "V, S, M (a diamond worth at least 1,000 gp and at least 1 cubic inch of flesh of the creature that is to be cloned, which the spell consumes, and a vessel worth at least 2,000 gp that has a sealable lid and is large enough to hold a medium creature, such as a large urn, coffin, mud-filled cyst in the ground, or crystal container filled with salt water)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell grows an inert duplicate of a living creature as a safeguard against death. This clone forms inside a sealed vessel and grows to full size and maturity after 120 days; you can also choose to have the clone be a younger version of th esame creature. It remains inert and endures indefinitely, as long as its vessel remains undisturbed.\n\nAt any time after the clone matures, if the original creature dies, its soul tranfers to the clone, provided that the soul is free and willing to return. The clone is physically identical to the original and has the same personality, memories, and abilities, but none of the original's equipment. The original creature's physical remains, if they still exist, become inert and can't thereafter be restured to life, since the creature's soul is elsewhere.",
            "duration": "Instantaneous",
            "level": "8",
            "name": "Clone",
            "range": "Touch",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "wizard",
                "level8"
            ],
            "type": "8th-level necromancy"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "cleric",
                "druid",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "burning incense and bits of earth and wood mixed in water"
                ],
                "raw": "V, S, M (burning incense and bits of earth and wood mixed in water)",
                "somatic": true,
                "verbal": true
            },
            "description": "You take control of the weather within 5 miles of you for the duration. You must be outdoors to cast this spell. Moving to a place where you don't have a clear path to the sky ends the spell early.\n\nWhen you cast the spell, you change the current weather conditions, which are determined by the DM based on the climate and season. You can change precipitation, temperature, and wind. It takes 1d4 x 10 minutes for the new conditions to take effect. Once they do so, you can change the conditions again. When the spell ends, the weather gradually returns to normal.\n\nWhen you change the weather conditions, find a current condition on the following tables and change its stage by one, up or down. When changing the wind, you can change its direction.\n\n## Precipitation\n\n|Stage|Condition|\n|---|---|\n| 1 | Clear |\n| 2 | Light clouds |\n| 3 | Overcast or ground fog |\n| 4 | Rain, hail, or snow |\n| 5 | Torrential rain, driving hail, or blizzard |\n\n## Temperature\n\n|Stage|Condition|\n|---|---|\n| 1 | Unbearable heat |\n| 2 | Hot |\n| 3 | Warm |\n| 4 | Cool |\n| 5 | Cold |\n| 6 | Arctic cold |\n\n## Wind\n\n|Stage|Condition|\n|---|---|\n| 1 | Calm |\n| 2 | Moderate wind |\n| 3 | Strong wind |\n| 4 | Gale |\n| 5 | Storm |",
            "duration": "Concentration, up to 8 hours",
            "level": "8",
            "name": "Control Weather",
            "range": "Self (5-mile radius)",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "cleric",
                "druid",
                "wizard",
                "level8"
            ],
            "type": "Wind"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "S",
                "somatic": true,
                "verbal": false
            },
            "description": "You create a shadowy door on a flat solid surface that you can see within range. The door is large enough to allow Medium creatures to pass through unhindered. When opened, the door leads to a demiplane that appears to be an empty room 30 feet in each dimension, made of wood or stone. When the spell ends, the door disappears, and any creatures or objects inside the demiplane remain trapped there, as the door also disappears from the other side.\n\nEach time you cast this spell, you can create a new demiplane, or have the shadowy door connect to a demiplane you created with a previous casting of this spell.  Additionally, if you know the nature and contents of a demiplane created by a casting of this spell by another creature, you can have the shadowy door connect to its demiplane instead.",
            "duration": "1 hour",
            "level": "8",
            "name": "Demiplane",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "warlock",
                "wizard",
                "level8"
            ],
            "type": "8th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You attempt to beguile a creature that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw.\n\nWhile the creature is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence. You can use this telepathic link to issue commands to the creature while you are conscious (no action required), which it does its best to obey. You can specify a simple and general course of action, such as \"Attack that creature,\" \"Run over there,\" or \"Fetch that object.\" If the creature completes the order and doesn't receive further direction from you, it defends and preserves itself to the best of its ability.\n\nYou can use your action to take total and precise control of the target. Until the end of your next turn, the creature takes only the actions you choose, and doesn't do anything that you don't allow it to do. During this time, you can also cause the creature to use a reaction, but this requires you to use your own reaction as well.\n\nEach time the target takes damage, it makes a new Wisdom saving throw against the spell. If the saving throw succeeds, the spell ends.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell with a 9th-level spell slot, the duration is concentration, up to 8 hours.",
            "level": "8",
            "name": "Dominate Monster",
            "range": "60 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level8"
            ],
            "type": "8th-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid",
                "sorcerer"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of dirt, a piece of rock, and a lump of clay"
                ],
                "raw": "V, S, M (a pinch of dirt, a piece of rock, and a lump of clay)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a seismic disturbance at a point on the ground that you can see within range. For the duration, an intense tremor rips through the ground in a 100-foot-radius circle centered on that point and shakes creatures and structures in contact with the ground in that area.\n\nThe ground in the area becomes difficult terrain. Each creature on the ground that is concentrating must make a Constitution saving throw. On a failed save, the creature's concentration is broken.\n\nWhen you cast this spell and at the end of each turn you spend concentrating on it, each creature on the ground in the area must make a Dexterity saving throw. On a failed save, the creature is knocked prone.\n\nThis spell can have additional effects depending on the terrain in the area, as determined by the DM.\n\nFissures. Fissures open throughout the spell’s area at the start of your next turn after you cast the spell. A total of 1d6 such fissures open in locations chosen by the DM. Each is 1d10 x 10 feet deep, 10 feet wide, and extends from one edge of the spell’s area to the opposite side. A creature standing on a spot where a fissure opens must succeed on a Dexterity saving throw or fall in. A creature that successfully saves moves with the fissure’s edge as it opens.\nA fissure that opens beneath a structure causes it to automatically collapse (see below).\n\nStructures. The tremor deals 50 bludgeoning damage to any structure in contact with the ground in the area when you cast the spell and at the start of each of your turns until the spell ends. If a structure drops to 0 hit points, it collapses and potentially damages nearby creatures. A creature within half the distance of a structure’s height must make a Dexterity saving throw. On a failed save, the creature takes 5d6 bludgeoning damage, is knocked prone, and is buried in the rubble, requiring a DC 20 Strength (Athletics) check as an action to escape. The DM can adjust the DC higher or lower, depending on the nature of the rubble. On a successful save, the creature takes half as much damage and doesn’t fall prone or become buried.",
            "duration": "Concentration, up to 1 minute",
            "level": "8",
            "name": "Earthquake",
            "range": "500 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "cleric",
                "druid",
                "sorcerer",
                "level8"
            ],
            "type": "8th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a handful fo clay, crystal, glass, or mineral spheres"
                ],
                "raw": "V, S, M (a handful fo clay, crystal, glass, or mineral spheres)",
                "somatic": true,
                "verbal": true
            },
            "description": "You blast the mind of a creature that you can see within range, attempting to shatter its intellect and personality. The target takes 4d6 psychic damage and must amke an Intelligence saving throw.\n\nOn a failed save, the creature's Intelligence and Charisma scores become 1. The creature can't cast spells, activate magic items, understand language, or communicate in any intelligible way. The creature can, however, identify its friends, follow them, and even protect them.\n\nAt the end of every 30 days, the creature can repeat its saving throw against this spell. If it succeeds on its saving throw, the spell ends.\n\nThe spell can also be ended by _[greater restoration](../greater-restoration/ \"greater restoration (lvl 5)\")_, _[heal](../heal/ \"heal (lvl 6)\")_, or _[wish](../wish/ \"wish (lvl 9)\")_.",
            "duration": "Instantaneous",
            "level": "8",
            "name": "Feeblemind",
            "range": "150 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "druid",
                "warlock",
                "wizard",
                "level8"
            ],
            "type": "8th-level enchantment"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "bard",
                "druid",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a hummingbird feather"
                ],
                "raw": "V, S, M (a hummingbird feather)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a willing creature and bestow a limited ability to see into the immediate future. For the duration the target can't be surprised and has advantage on attack rolls, ability checks, and saving throws. Additionally, other creatures have disadvantage on attack rolls against the target for the duration.\n\nThis spell immediately ends if you cast it again before its duration ends.",
            "duration": "8 hours",
            "level": "9",
            "name": "Foresight",
            "range": "Touch",
            "ritual": false,
            "school": "divination",
            "tags": [
                "bard",
                "druid",
                "warlock",
                "wizard",
                "level9"
            ],
            "type": "9th-level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a diamond worth at least 5,000 gp"
                ],
                "raw": "V, S, M (a diamond worth at least 5,000 gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "You conjure a portal linking an unoccupied space you can see whithin range to a precise location on a different plane of existence. The portal is a circular opening, which you can make 5 to 20 feet in diameter. You can orient the portal in any direction you choose. The portal lasts for the duration.\n\nThe portal has a front and a back on each plane where it appears. Travel through the portal is possible only by moving through its front. Anything that does so is instantly transported to the other plane, appearing in the unoccupied space nearest to the portal.\n\nDeities and other planar rulers can prevent portals created by this spell from opening in their presence or anywhere within their domains.\n\nWhen you cast this spell, you can speak the name of a specific creature (a pseudonym, title or nickname doesn't work). If that creature is on a plane other than the one you are on, the portal opens in the named creature's immediate vicinity and draws the creature through it to the nearest unoccupied space on your side of the portal. You gain no special power over the creature, and it is free to act as the DM deems appropriate. It might leave, attack you or help you.",
            "duration": "Concentration, up to 1 minute",
            "level": "9",
            "name": "Gate",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "cleric",
                "sorcerer",
                "wizard",
                "level9"
            ],
            "type": "9th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "warlock"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "Until the spell ends, when you make a Charisma check, you can replace the number you roll with a 15. Additionally, no matter what you say, magic that would determine if you are telling the truth indicates that you are being truthful.",
            "duration": "1 hour",
            "level": "8",
            "name": "Glibness",
            "range": "Self",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "warlock",
                "level8"
            ],
            "type": "8th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a tiny reliquary worth at least 1,000 gp containing a sacred relic, such as a scrap of cloth from a saint's robe or a piece of parchment from a religious text"
                ],
                "raw": "V, S, M (a tiny reliquary worth at least 1,000 gp containing a sacred relic, such as a scrap of cloth from a saint's robe or a piece of parchment from a religious text)",
                "somatic": true,
                "verbal": true
            },
            "description": "Divine light washes out from you and coalesces in a soft radiance in a 30-foot radius around you. Creatures of your choice in that radius when you cast this spell shed dim light in a 5-foot radius and have advantage on all saving throws, and other creatures have disadvantage on attack rolls against them until the spell ends. In addition, when a fiend or an undead hits an affected creature with a melee attack, the aura flashes with brilliant light. The attacker must succeed on a Constitution saving throw or be blinded until the spell ends.",
            "duration": "Concentration, up to 1 minute",
            "level": "8",
            "name": "Holy Aura",
            "range": "Self",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "level8"
            ],
            "type": "8th-level abjuration"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a vellum depiction or a carved statuette in the likeness of the target, and a special component that varies according to the version of the spell you choose, worth at least 500 gb per Hit Die of the target"
                ],
                "raw": "V, S, M (a vellum depiction or a carved statuette in the likeness of the target, and a special component that varies according to the version of the spell you choose, worth at least 500 gb per Hit Die of the target)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a magical restraint to hold a creature that you can see within range. The target must succeed on a Wisdom saving throw or be bound by the spell; if it succeeds, it is immune to this spell if you cast it again. While affected by this spell, the creature doesn't need to breathe, eat, or drink, and it doesn't age. Divination spells can't locate or perceive the target.\n\nWhen you cast the spell, you choose one of the following forms of imprisonment.\n\nBurial: The target is entombed far beneath the earth in a Sphere of magical force that is just large enough to contain the target. Nothing can pass through the Sphere, nor can any creature Teleport or use Planar Travel to get into or out of it.\nThe special component for this version of the spell is a small mithral orb.\n\nChaining: Heavy chains, firmly rooted in the ground, hold the target in place. The target is Restrained until the spell ends, and it can't move or be moved by any means until then.\nThe special component for this version of the spell is a fine chain of precious metal.\n\nHedged Prison: The spell transports the target into a tiny Demiplane that is warded against teleportation and Planar Travel. The Demiplane can be a labyrinth, a cage, a tower, or any similar confined structure or area of your choice.\nThe special component for this version of the spell is a miniature representation of the prison made from jade.\n\nMinimus Containment: The target shrinks to a height of 1 inch and is imprisoned inside a gemstone or similar object. Light can pass through the gemstone normally (allowing the target to see out and other creatures to see in), but nothing else can pass through, even by means of teleportation or Planar Travel. The gemstone can't be cut or broken while the spell remains in Effect.\nThe special component for this version of the spell is a large, transparent gemstone, such as a corundum, diamond, or ruby.\n\nSlumber: The target falls asleep and can't be awoken.\nThe Special component for this version of the spell consists of rare soporific herbs.\n\nEnding the Spell: During the casting of the spell, in any of its versions, you can specify a condition that will cause the spell to end and release the target. The condition can be as specific or as elaborate as you choose, but the DM must agree that the condition is reasonable and has a likelihood of coming to pass. The Conditions can be based on a creature's name, identity, or deity but otherwise must be based on observable Actions or qualities and not based on intangibles such as level, class, or Hit Points.\n\nA _dispel magic_ spell can end the spell only if it is cast as a 9th-level spell, targeting either the prison or the special component used to create it.\n\nYou can use a particular special component to create only one prison at a time. If you cast the spell again using the same component, the target of the first casting is immediately freed from its binding.",
            "duration": "Until dispelled",
            "level": "9",
            "name": "Imprisonment",
            "range": "30 feet",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "warlock",
                "wizard",
                "level9"
            ],
            "type": "9th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A swirling cloud of smoke shot through with white-hot embers appears in a 20-foot-range. The cloud spreads around corners and is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.\n\nWhen the cloud appears, each creature in it must make a Dexterity saving throw. A creature takes 10d8 fire damage on a failed save, or half as much damage on a successful one. A creature must also make this saving throw when it enters the spell's area for the first time on a turn or ends its turn there.\n\nThe cloud moves 10 feet directly away from you in a direction that you choose at the start of each of your turns.",
            "duration": "Concentration, up to 1 minute",
            "level": "8",
            "name": "Incendiary Cloud",
            "range": "150 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "sorcerer",
                "wizard",
                "level8"
            ],
            "type": "8th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A flood of healing energy flows from you into injured creatures around you. You restore up to 700 hit points, divided as you choose among any number of creatures that you can see within range. Creatures healed by this spell are also cured of all diseases and any effect making them blinded or deafened. This spell has no effect on undead or constructs.",
            "duration": "Instantaneous",
            "level": "9",
            "name": "Mass Heal",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "cleric",
                "level9"
            ],
            "type": "9th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You banish a creature that you can see within range into a labyrinthine demiplane. The target remains there for the duration or until it escapes the maze.\n\nThe target can use its action to attempt to escape. When it does so, it makes a DC 20 Intelligence check. If it succeeds, it escapes, and the spell ends (a minotaur or goristro demon automatically succeeds).\n\nWhen the spell ends, the target reappears in the space it left or, if that space is occupied, in the nearest unoccupied space.",
            "duration": "Concentration, up to 10 minutes",
            "level": "8",
            "name": "Maze",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "wizard",
                "level8"
            ],
            "type": "8th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Blazing orbs of fire plummet to the ground at four different points you can see within range. Each creature in a 40-foot-radius sphere centered on each point you choose must make a Dexterity saving throw. The sphere spreads around corners. A creature takes 20d6 fire damage and 20d6 bludgeoning damage on a failed save, or half as much damage on a successful one. A creature in the area of more than one fiery burst is affected only once.\n\nThe spell damages objects in the area and ignites flammable objects that aren't being worn or carried.",
            "duration": "Instantaneous",
            "level": "9",
            "name": "Meteor Swarm",
            "range": "1 mile",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "level9"
            ],
            "type": "9th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Until the spell ends, one willing creature you touch is immune to psychic damage, any effect that would sense its emotions or read its thoughts, divination spells, and the charmed condition. The spell even foils _[wish](../wish/ \"wish (lvl 9)\")_ spells and spells or effects of similar power used to affect the target's mind or to gain information about the target.",
            "duration": "24 hours",
            "level": "8",
            "name": "Mind Blank",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "bard",
                "wizard",
                "level8"
            ],
            "type": "8th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A wave of healing energy washes over the creature you touch. The target regains all its hit points. If the creature is charmed, frightened, paralyzed, or stunned, the condition ends. If the creature is prone, it can use its reaction to stand up. This spell has no effect on undead or constructs.",
            "duration": "Instantaneous",
            "level": "9",
            "name": "Power Word Heal",
            "range": "Touch",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "bard",
                "level9"
            ],
            "type": "9th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You utter a word of power that can compel one creature you can see within range to die instantly.  If the creature you choose has 100 hit points or fewer, it dies. Otherwise, the spell has no effect.",
            "duration": "Instantaneous",
            "level": "9",
            "name": "Power Word Kill",
            "range": "60 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level9"
            ],
            "type": "9th-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You speak a word of power that can overwhelm the mind of one creature you can see within range, leaving it dumbfounded. If the target has 150 hit points or fewer, it is stunned. Otherwise, the spell has no effect.\n\nThe stunned target must make a Constitution saving throw at the end of each of its turns.  On a successful save, this stunning effect ends.",
            "duration": "Instantaneous",
            "level": "8",
            "name": "Power Word Stun",
            "range": "60 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level8"
            ],
            "type": "8th-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A shimmering, multicolored plane of light forms a vertical opaque wall--up to 90 feet long, 30 feet high, and 1 inch thick--centered on a point you can see within range. Alternatively, you can shape the wall into a sphere up to 30 feet in diameter centered on a point you choose within range. The wall remains in place for the duration. If you position the wall so that it passes through a space occupied by a creature, the spell fails, and your action and the spell slot are wasted.\n\nThe wall sheds bright light out to a range of 100 feet and dim light for an additional 100 feet. You and creatures you designate at the time you cast the spell can pass through and remain near the wall without harm. If another creature that can see the wall moves to within 20 feet of it or starts its turn there, the creature must succeed on a Constitution saving throw or become blinded for 1 minute.\n\nThe wall consists of seven layers, each with a different color. When a creature attempts to reach into or pass through the wall, it does so one layer at a time through all thew wall's layers. As it passes or reaches through each layer, the creature must make a Dexterity saving throw or be affected by that layer's properties as described below.\n\nThe wall can be destroyed, also one layer at a time, in order from red to violet, by means specific to each layer. Once a layer is destroyed, it remains so for the Duration of the spell. A rod of cancellation destroys a prismatic wall, but an Antimagic Field has no Effect on it.\n\nRed: The creature takes 10d6 fire damage on a failed save, or half as much damage on a successful one. While this layer is in place, nonmagical Ranged Attacks can't pass through the wall. The layer can be destroyed by dealing at least 25 cold damage to it.\n\nOrange: The creature takes 10d6 acid damage on a failed save, or half as much damage on a successful one. While this layer is in place, magical Ranged Attacks can't pass through the wall. The layer is destroyed by a Strong Wind.\n\nYellow: The creature takes 10d6 lightning damage on a failed save, or half as much damage on a successful one. This layer can be destroyed by dealing at least 60 force damage to it.\n\nGreen: The creature takes 10d6 poison damage on a failed save, or half as much damage on a successful one. A Passwall spell, or another spell of equal or greater level that can open a portal on a solid surface, destroys this layer.\n\nBlue: The creature takes 10d6 cold damage on a failed save, or half as much damage on a successful one. This layer can be destroyed by dealing at least 25 fire damage to it.\n\nIndigo: On a failed save, the creature is Restrained. It must then make a Constitution saving throw at the end of each of its turns. If it successfully saves three times, the spell ends. If it fails its save three times, it permanently turns to stone and is subjected to the Petrified condition. The successes and failures don't need to be consecutive, keep track of both until the creature collects three of a kind. While this layer is in place, Spells can't be cast through the wall. The layer is destroyed by bright light shed by a Daylight spell or a similar spell of equal or higher level.\n\nViolet: On a failed save, the creature is Blinded. It must then make a Wisdom saving throw at the start of your next turn. A successful save ends the blindness. If it fails that save, the creature is transported to another plane of the DM's choosing and is no longer Blinded. (Typically, a creature that is on a plane that isn't its home plane is banished home, while other creatures are usually cast into the Astral or Ethereal planes.) This layer is destroyed by a Dispel Magic spell or a similar spell of equal or higher level that can end Spells and magical Effects.",
            "duration": "10 minutes",
            "level": "9",
            "name": "Prismatic Wall",
            "range": "60 feet",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "wizard",
                "level9"
            ],
            "type": "9th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a jade circlet worth at least 1,500 gp, which you must place on your head before you cast the spell"
                ],
                "raw": "V, S, M (a jade circlet worth at least 1,500 gp, which you must place on your head before you cast the spell)",
                "somatic": true,
                "verbal": true
            },
            "description": "You assume the form of a different creature for the duration. The new form can be of any creature with a challenge rating equal to your level or lower. The creature can't be a construct or an undead, and you must have seen the sort of creature at least once. You transform into an average example of that creature, one without any class levels or the Spellcasting trait.\n\nYour game statistics are replaced by the statistics of the chosen creature, though you retain your alignement and Intelligence, Wisdom and Charisma scores. You also retain all of your skill and saving throw proficiencies, in addition to gaining those of the creature. If the creature has the same proficiency as you and the bonus listed in its statistics is higher than yours, use the creature's bonus in place of yours. You can't use any legendary actions or lair actions of the new form.\n\nYou assume the hit points and Hit Dice of the new form. When you revert to your normal form, you return to the number of hit points you had before you transformed. If you revert as a result of dropping to 0 hit points, any excess damage carries over to your normal form. As long as the excess damage doesn't reduce your normal form to 0 hit points, you aren't knocked unconscious.\n\nYou retain the benefit of any features from your class, race, or other source and can use them, provided that your new form is physically capable of doing so. You can't use any special senses you have (for example, darkvision) unless your new form also has that sense. You can only speak if the creature can normally speak.\n\nWhen you transform, you choose whether your equipment falls to the ground, merges into the new form, or is worn by it. Worn equipment functions as normal. The DM determines whether it is practical for the new form to wear a piece of equipment, based on the creature's shape and size. Your equipment doesn't change shape or size to match the new form, and any equipment that the new form can't wear must either fall to the ground or merge into your new form. Equipment that merges has no effect in that state.\n\nDuring this spell's Duration, you can use your action to assume a different form following the same restrictions and rules for the original form, with one exception - if your new form has more hit pints than your current one, your Hit Points remain at their current value.",
            "duration": "Concentration, up to 1 hour",
            "level": "9",
            "name": "Shapechange",
            "range": "Self",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "wizard",
                "level9"
            ],
            "type": "9th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A churning storm cloud forms, centered on a point you can see and spreading to a radius of 360 feet. Lightning flashes in the area, thunder booms, and strong winds roar. Each creature under the cloud (no more than 5,000 feet beneath the cloud) when it appears must make a Constitution saving throw. On a failed save, a creature takes 2d6 thunder damage and becomes deafened for 5 minutes.\n\nEach round you maintain concentration on this spell, the storm produces additional effects on your turn.\n\nRound 2: Acidic rain falls from the cloud. Each creature and object under the cloud takes 1d6 acid damage.\n\nRound 3: You call six bolts of lightning from the cloud to strike six creatures or Objects of your choice beneath the cloud. A given creature or object can't be struck by more than one bolt. A struck creature must make a Dexterity saving throw. The creature takes 10d6 lightning damage on a failed save, or half as much damage on a successful one.\n\nRound 4: Hailstones rain down from the cloud. Each creature under the cloud takes 2d6 bludgeoning damage.\n\nRound 5-10: Gusts and freezing rain assail the area under the cloud. the area becomes Difficult Terrain and is heavily obscured. Each creature there takes 1d6 cold damage. Ranged weapon attacks in the area are impossible. The wind and rain count as a severe distraction for the purposes of maintaining Concentration on Spells. Finally, gusts of Strong Wind (ranging from 20 to 50 miles per hour) automatically disperse fog, mists, and similar phenomena in the area whether mundane or magical.",
            "duration": "Concentration, up to 1 minute",
            "level": "9",
            "name": "Storm of Vengeance",
            "range": "Sight",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "level9"
            ],
            "type": "9th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pair of linked silver rings"
                ],
                "raw": "V, S, M (a pair of linked silver rings)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a telepathic link between yourself and a willing creature with which you are familiar. The creature can be anywhere on the same plane of existence as you. The spell ends if you or the target are no longer on the same plane.\n\nUntil the spell ends, you and the target can instantaneously share words, images, sounds and other sensory messages with one another through the link, and the target recognizes you as the creature it is communicating with. The spell enables a creature with an Intelligence score of at least 1 to understand the meaning of your words and take in the scope of any sensory messages you send to it.",
            "duration": "24 hours",
            "level": "8",
            "name": "Telepathy",
            "range": "Unlimited",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "wizard",
                "level8"
            ],
            "type": "8th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "fire and a piece of sunstone"
                ],
                "raw": "V, S, M (fire and a piece of sunstone)",
                "somatic": true,
                "verbal": true
            },
            "description": "Brilliant sunlight flashes in a 60-foot radius centered on a point you choose within range. Each creature in that light must make a Constitution saving throw. On a failed save, a creature takes 12d6 radiant damage and is blinded for 1 minute. On a successful save, it takes half as much damage and isn't blinded by this spell. Undead and oozes have disadvantage on this saving throw.\n\nA creature blinded by this spell makes another Constitution saving throw at the end of each of its turns. On a successful save, it is no longer blinded.\n\nThis spell dispels any darkness in its area that was created by a spell.",
            "duration": "Instantaneous",
            "level": "8",
            "name": "Sunburst",
            "range": "150 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "level8"
            ],
            "type": "8th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You briefly stop the flow of time for everyone but yourself. No time passes for other creatures, while you take 1d4 + 1 turns in a row, during which you can use actions and move as normal.\n\nThis spell ends if one of the actions you use during this period, or any effects that you create during this period, affects a creature other than you or an object being worn or carried by someone other than you. In addition, the spell ends if you move to a place more than 1,000 feet form the location where you cast it.",
            "duration": "Instantaneous",
            "level": "9",
            "name": "Time Stop",
            "range": "Self",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "wizard",
                "level9"
            ],
            "type": "9th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a drop of mercury, a dollop of gum arabic, and a wisp of smoke"
                ],
                "raw": "V, S, M (a drop of mercury, a dollop of gum arabic, and a wisp of smoke)",
                "somatic": true,
                "verbal": true
            },
            "description": "Choose one creature or nonmagical object that you can see within range. You transform the creature into a different creature, the creature into an object or the object into a creature (the object must be neither worn nor carried by another creature). The transformation lasts for the duration, or until the target drops to 0 hit points or dies. If you concentrate on this spell for the full duration, the transformation lasts until it is dispelled.\n\nShapechangers aren't affected by this spell. An unwilling creature can make a Wisdom saving throw, and if it succeeds, it isn't affected by this spell.\n\nCreature into Creature: If you turn a creature into another kind of creature, the new form can be any kind you choose whose Challenge Rating is equal to or less than the target's (or its level, if the target doesn't have a Challenge rating). The target's game Statistics, including mental Ability Scores, are replaced by the Statistics of the new form. It retains its Alignment and Personality.\nThe target assumes the Hit Points of its new form, and when it reverts to its normal form, the creature returns to the number of Hit Points it had before it transformed. If it reverts as a result of Dropping to 0 Hit Points, any excess damage carries over to its normal form. As long as the excess damage doesn't reduce the creature's normal form to 0 Hit Points, it isn't knocked Unconscious.\nThe creature is limited in the Actions it can perform by the Nature of its new form, and it can't speak, cast Spells, or take any other action that requires hands or Speech unless its new form is capable of such Actions.\nThe target's gear melds into the new form. The creature can't activate, use, wield, or otherwise benefit from any of its Equipment.\n\nObject into Creature: You can turn an object into any kind of creature, as long as the creature's size is no larger than the object's size and the creature's Challenge Rating is 9 or lower. The creature is friendly to you and your companions. It acts on each of your turns. You decide what action it takes and how it moves. The DM has the creature's Statistics and resolves all of its Actions and Movement.\nIf the spell becomes permanent, you no longer control the creature. It might remain friendly to you, depending on how you have treated it.\n\nCreature into Object: If you turn a creature into an object, it transforms along with whatever it is wearing and carrying into that form. The creature's Statistics become those of the object, and the creature has no memory of time spent in this form, after the spell ends and it returns to its normal form.",
            "duration": "Concentration, up to 1 hour",
            "level": "9",
            "name": "True Polymorph",
            "range": "30 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "warlock",
                "wizard",
                "level9"
            ],
            "type": "9th-level transmutation"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A wall of water springs into existence at a point you choose within range. You can make the wall up to 300 feet long, 300 feet high, and 50 feet thick. The wall lasts for the duration.\n\nWhen the wall appears, each creature within its area must make a Strength saving throw. On a failed save, a creature takes 6d10 bludgeoning damage, or half as much damage on a successful save.\n\nAt the start of each of your turns after the wall appears, the wall, along with any creatures in it, moves 50 feet away from you. Any Huge or smaller creature inside the wall or whose space the wall enters when it moves must succeed on a Strength saving throw or take 5d10 bludgeoning damage. A creature can take theis damage only once per round. At the end of the turn, the wall's height is reduced by 50 feet, and the damage creatures take from the the spell on subsequent rounds is reduced by 1d10. When the wall reaches 0 feet in height, the spell ends.\n\nA creature caught in the wall can move by swimming. Because of the force of the wave, though, the creature must make a successful Strength (Athletics) check against your spell save DC in order to move at all. If it fails the check, it can't move. A creature that moves out of the area falls to the ground.",
            "duration": "Concentration, up to 6 rounds",
            "level": "8",
            "name": "Tsunami",
            "range": "Sight",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "level8"
            ],
            "type": "8th-level conjuration"
        },
        {
            "casting_time": "1 hour",
            "classes": [
                "cleric",
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a sprinkle of holy water and diamonds worth at least 25,000 gp, which the spell consumes"
                ],
                "raw": "V, S, M (a sprinkle of holy water and diamonds worth at least 25,000 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a creature that has been dead for no longer than 200 years and that died for any reason except old age. If the creature's soul is free and willing, the creature is restored to life with all its hit points.\n\nThis spell closes all wounds, neutralizes any poison, cures all diseases, and lifts any curses affecting the creature when it died. The spell replaces damaged or missing organs and limbs.\n\nThe spell can even provide a new body if the original no longer exists, in which case you must speak the creature's name. The creature then appears in an unoccupied space you choose within 10 feet of you.",
            "duration": "Instantaneous",
            "level": "9",
            "name": "True Resurrection",
            "range": "Touch",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "cleric",
                "druid",
                "level9"
            ],
            "type": "9th-level necromancy"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Drawing on the deepest fears of a group of creatures, you create illusory creatures in their minds, visible only to them. Each creature in a 30-foot-radius sphere centered on a point of your choice within range must make a Wisdom saving throw. On a failed save, a creature becomes frightened for the duration. The illusion calls on the creature's deepest fears, manifesting its worst nightmares as an implacable threat. At the start of each of the frightened creature's turns, it must succeed on a Wisdom saving throw or take 4d10 psychic damage. On a successful save, the spell ends for that creature.",
            "duration": "Concentration, up to 1 minute",
            "level": "9",
            "name": "Weird",
            "range": "120 feet",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "wizard",
                "level9"
            ],
            "type": "9th-level illusion"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "_Wish_ is the mightiest spell a mortal creature can cast. By simply speaking aloud, you can alter the very foundations of reality in accord with your desires.\n\nThe basic use of this spell is to duplicate any other spell of 8th level or lower. You don't need to meet any requirements in that spell, including costly components. The spell simply takes effect.\n\nAlternatively, you can create one of the following effects of your choice:\n\n* You create one object of up to 25,000 gp in value that isn't a magic item. The object can be no more than 300 feet in any dimension, and it appears in an unoccupied space you can see on the ground.\n\n* You allow up to twenty creatures that you can see to regain all hit points, and you end all effects on them described in the _greater restoration_ spell.\n\n* You grant up to ten creatures that you can see resistance to a damage type you choose.\n\n* You grant up to ten creatures you can see immunity to a single spell or other magical effect for 8 hours. For instance, you could make yourself and all your companions immune to a lich's life drain attack.\n\n* You undo a single recent event by forcing a reroll of any roll made within the last round (including your last turn). Reality reshapes itself to accomodate the new result. For example, a _wish_ spell could undo an opponent's successful save, a foe's critical hit, or a friend's failed save. You can force the reroll to be made with advantage or disadvantage, and you can choose whether to use the reroll or the original roll.\n\nYou might be able to achieve something beyond the scope of the above examples. State your wish to the DM as precisely as possible. The DM has great latitude in ruling what occurs in such an instance; the greater the wish, the greater the likelihood that something goes wrong. This spell might simply fail, the effect you desire might only be partly achieved, or you might suffer some unforeseen consequence as a result of how you worded the wish. For example, wishing that a villain were dead might propel you forward in time to a period when that villain is no longer alive, effectively removing you from the game. Similarly, wishing for a legendary magic item or artifact might instantly transport you to the presence of the item's current owner.\n\nThe stress of casting this spell to produce any effect other than duplicating another spell weakens you. After enduring that stress, each time you cast a spell until you finish a long rest, you take 1d10 necrotic damage per level of that spell. This damage can't be reduced or prevented in any way. In addition, you Strength drops to 3 if it isn't 3 or lower already, for 2d4 days. For each of those days that you spend resting and doing nothing more than light activity, your remaining recovery time decreases by 2 days. Finally, there is a 33 percent chance that you are unable to cast _wish_ ever again if you suffer this stress.",
            "duration": "Instantaneous",
            "level": "9",
            "name": "Wish",
            "range": "Self",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "sorcerer",
                "wizard",
                "level9"
            ],
            "type": "9th-level conjuration"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You summon a celestial of challenge rating 4 or lower, which apperas in an unoccupied space that you can see within range. The celestial disappears when it drops to 0 hit points or when the spell ends.\n\nThe celestial is friendly to you and your companions for the duration. Roll initiative for the celestial, which has its own turns. It obeys any verbal commands that you issue to it (no action required by you), as long as they don't violate its alignment. If you don't issue any commands to the celestial, it defends itself from hostile creatures but otherwise takes no actions.\n\nThe DM has the celestial's statistics.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell using a 9th-level spell slot, you summon a celestial of challenge rating 5 or lower.",
            "level": "7",
            "name": "Conjure Celestial",
            "range": "90 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "cleric",
                "level7"
            ],
            "type": "7th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a tiny ball of bat guano and sulfur"
                ],
                "raw": "V, S, M (a tiny ball of bat guano and sulfur)",
                "somatic": true,
                "verbal": true
            },
            "description": "A beam of yellow light flashes from your pointing finger, then condenses to linger at a chose point within range as a glowing bead for the duration. When the spell ends, either because your concentration is broken or because you decide to end it, the bead blossoms with a low roar into an explosion of flame that spreads around corners. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A creature takes fire damage equal to the total accumulated damage on a failed save, or half as much damage on a successful one.\n\nThe spell's base damage is 12d6. If at the end of your turn the bead has not yet detonated, the damage increases by 1d6.\n\nIf the glowing bead is touched before the interval has expired, the creature touching it must make a Dexterity saving throw. On a failed save, the spell ends immediately, causing the bead to erupt in flame. On a successful save, the creature can throw the bead up to 40 feet. When it strikes a creature or a solid object, the spell ends, and the bead explodes.\n\nThe fire damages objects in the area dn ignites flammable objects that aren't being worn or carried.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast theis spell using a spell slot of 8th level or higher, the base damage increases by 1d6 for each slot level above 7th.",
            "level": "7",
            "name": "Delayed Blast Fireball",
            "range": "150 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "level7"
            ],
            "type": "7th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired. It can be a place you can see, one you can visualise, or one you can describe by stating distance and direction, such as \"200 feet straight downward\" or \"upward to the northwest at a 45-degree angle, 300 feet.\"\n\nYou can bring along objects as long as their weight doesn't exceed what you can carry. You can also bring one willing creature of your size or smaller who is carrying gear up to its carrying capacity. The creature must be within 5 feet of you when you cast this spell.\n\nIf you would arrive in a place already occupied by an object or a creature, you and any creature travelling with you each take 4d6 force damage, and the spell fails to teleport you.",
            "duration": "Instantaneous",
            "level": "4",
            "name": "Dimension Door",
            "range": "500 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level4"
            ],
            "type": "4th-level conjuration"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You utter a divine word, imbued with the power that shaped the world at the dawn of creation. Choose any number of creatures you can see within range. Each creature that can hear you must make a Charisma saving throw. On a failed save, a creature suffers an effect based on its current hit points:\n\n* 50 hit points or fewer: deafened for 1 minute\n* 40 hit points or fewer: deafened and blinded for 10 minutes\n* 30 hit points or fewer: blinded, deafened, and stunned for 1 hour\n* 20 hit points or fewer: killed instantly\n\nRegardless of its current hit points, a celestial, an element, a fey or a fiend that fails its save is forced back to its plane of origin (if it isn't there already) and can't return to your current plane for 24 hours by any means short of a wish spell.",
            "duration": "Instantaneous",
            "level": "7",
            "name": "Divine Word",
            "range": "30 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "cleric",
                "level7"
            ],
            "type": "7th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You step into the border regions of the Ethereal Plane, in the area where it overlaps with your current plane. You remain in the Border Ethereal for the duration or until you use your action to dismiss the spell. During this time, you can move in any direction. If you move up or down, every foot of movement costs an extra foot. You can see and hear the plane you originated from, but everything there looks gray, and you can't see anything more than 60 feet away.\n\nWhile on the Ethereal Plane, you can only affect and be affected by other creatures on that plane. Creatures that aren't on the Ethereal Plane can't perceive you and can't interact with you, unless a special ability or magic has given them the ability to do so.\n\nYou ignore all objects and effects that aren't on the Ethereal Plane, allowing you to move through objects you perceive on the plane you originated from.\n\nWhen the spell ends, you immediately return to the plan you originated from in the spot you currently occupy.  If you occupy the same spot as a solid object or creature when this happens, you are immediately shunted to the nearest unoccupied space that you can occupy and take force damage equal to twice the number of feet you are moved.\n\nThis spell has no effect if you cast it while you are on the Ethereal Plane or a plane that doesn't border it, such as one of the Outer Planes.",
            "duration": "Up to 8 hours",
            "higher_levels": "When you cast this spell using a spell slot of 8th level or higher, you can target up to three willing creatures (including you) for each slot level above 7th. The creatures must be within 10 feet of you when you cast the spell.",
            "level": "7",
            "name": "Etherealness",
            "range": "Self",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "cleric",
                "sorcerer",
                "warlock",
                "wizard",
                "level7"
            ],
            "type": "7th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You send negative engery coursing through a creature that you can see within range, causing it searing pain. The target must make a Constitution saving throw. It takes 7d8 + 30 necrotic damage on a failed save, or half as much damage on a successful one.\n\nA humanoid killed by this spell rises at the start of your next turn as a zombie that is permanently under your command, following your verbal orders to the best of its ability.",
            "duration": "Instantaneous",
            "level": "7",
            "name": "Finger of Death",
            "range": "60 feet",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "sorcerer",
                "warlock",
                "wizard",
                "level7"
            ],
            "type": "7th-level necromancy"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid",
                "sorcerer"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A storm made up of sheets of roaring flame appears in a location you choose within range. The area of the storm consists of up to ten 10-foot-cubes, which you can arrange as you wish. Each cube must have at least one face adjacent to the face of another cube. Each creature in the area must make a Dexterity saving throw. It takes 7d10 fire damage on a failed save, or half as much damage on a successful one.\n\nThe fire damages objects in the area and ignites flammable objects that aren't being worn or carried. If you choose, plant life in the area is unaffected by this spell.",
            "duration": "Instantaneous",
            "level": "7",
            "name": "Fire Storm",
            "range": "150 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "cleric",
                "druid",
                "sorcerer",
                "level7"
            ],
            "type": "7th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "ruby dust worth 1,500 gp"
                ],
                "raw": "V, S, M (ruby dust worth 1,500 gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "An immobile, invisible, cube-shaped prison composed of magical force springs into existence around an area you choose within range. The prison can be a cage or a solid box, as you choose.\n\nA prison in the shape of a cage can be up to 20 feet on a side and is made from 1/2-inch diameter bars spaced 1/2-inch apart.\n\nA prison in the shape of a box can be up to 10 feet on a size, creating a solid barrier that prevents any matter from passing through it and blocking any spells cast into or out from the area.\n\nWhen you cast the spell, any creature that is completely inside the cage's area is trapped. Creatures only partially within the area, or those too large to fit inside the area, are pushed away from the center of the area until they are completely outside the area.\n\nA creature inside the cage can't leave it by nonmagical means. If the creature tries to use teleportation or interplanar travel to leave the cage, it must first make a Charisma saving throw. On a success, the creature can use that magic to exit the cage. On a failure, the creature can't exit the cage and wastes the use of the spell or effect. The cage also extends into the Ethereal Plane, blocking ethereal travel.\n\nThis spell can't be dispelled by _[dispel magic](../dispel-magic/ \"dispel magic (lvl 3)\")_.",
            "duration": "1 hour",
            "level": "7",
            "name": "Forcecage",
            "range": "100 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "bard",
                "warlock",
                "wizard",
                "level7"
            ],
            "type": "7th-level evocation"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "bard",
                "druid",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You make terrain in a area up to 1 mile square look, sound, smell, and even feel like some other sort of terrain. The terrain's general shape remains the same, however. Open fields or a road could be made to resemble a swamp, hill, crevasse, or some other difficult or impassable terrain. A pond can be made to seem like a grassy meadow, a precipice like a gental slope, or a rock-strewn gully like a wide and smooth road.\n\nSimilarly, you can alter the appearance of structures, and add them where none are present. The spell doesn't disguise, conceal or add creatures.\n\nThe illusion includes audible, visual, tactile, and olfactory elements, so it can turn clear ground into difficult terrain (or vice versa) or otherwise impede movement through the area. Any piece of the illusory terrain (such as a rock or stick) that is removed from the spell's area disappears immediately.\n\nCreatures with truesight can see through the illusion to the terrain's true form; however, all other elements of the illusion remain, so while the creature is aware of the illusion's presence, the creature can still physically interact with the illusion.",
            "duration": "10 days",
            "level": "7",
            "name": "Mirage Arcane",
            "range": "Sight",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "druid",
                "wizard",
                "level7"
            ],
            "type": "7th-level illusion"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Eight multicolored rays of light flash from your hand. Each ray is a different color and has a different power and purpose. Each creature in a 60-foot code must make a Dexterity saving throw. For each target, roll a d8 to determine which color ray affects it.\n\n1-Red: The target takes 10d6 fire damage on a failed save, or half as much damage on a successful one.\n\n2-Orange: The target takes 10d6 acid damage on a failed save, or half as much damage on a successful one.\n\n3-Yellow: The target takes 10d6 lightning damage on a failed save, or half as much damage on a successful one.\n\n4-Green: The target takes 10d6 poison damage on a failed save, or half as much damage on a successful one.\n\n5-Blue: The target takes 10d6 cold damage on a failed save, or half as much damage on a successful one.\n\n6-Indigo: On a failed save, the target is Restrained. It must then make a Constitution saving throw at the end of each of its turns. If it successfully saves three times, the spell ends. If it fails its save three times, it permanently turns to stone and is subjected to the Petrified condition. The successes and failures don't need to be consecutive, keep track of both until the target collects three of a kind.\n\n7-Violet: On a failed save, the target is Blinded. It must then make a Wisdom saving throw at the start of your next turn. A successful save ends the blindness. If it fails that save, the creature is transported to another plane of existence of the DM's choosing and is no longer Blinded. (Typically, a creature that is on a plane that isn't its home plane is banished home, while other creatures are usually cast into the Astral or Ethereal planes.)\n\n8-Special: The target is struck by two rays. Roll twice more, rerolling any 8.",
            "duration": "Instantaneous",
            "level": "7",
            "name": "Prismatic Spray",
            "range": "Self (60-foot cone)",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "level7"
            ],
            "type": "7th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a small replica of you made from materials worth at least 5 gp"
                ],
                "raw": "V, S, M (a small replica of you made from materials worth at least 5 gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create an illusory copy of yourself that lasts for the duration. The copy can appear at any location within range that you have seen before, regardless of intervening obstacles. The illusion looks and sounds like you but is intangible. If the illusion takes any damage, it disappears, and the spell ends.\n\nYou can use your action to move this illusion up to twice your speed, and make it gesture, speak, and behave in whatever way you choose. It mimics your mannerisms perfectly.\n\nYou can see through its eyes and hear through its ears as if you were in its space. On your turn as a bonus action, you can switch from using its senses to using your own, or back again. While you are using its senses, you are blinded and deafened in regard to your own surroundings.\n\nPhysical interaction with the image reveals it to be an illusion, because things can pass through it. A creature that uses its action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image, and any noise it makes sounds hollow to the creature.",
            "duration": "Concentration, up to 1 day",
            "level": "7",
            "name": "Project Image",
            "range": "500 miles",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "wizard",
                "level7"
            ],
            "type": "7th-level illusion"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a forked, metal rod worth at least 250 gp, attuned to a particular plane of existence"
                ],
                "raw": "V, S, M (a forked, metal rod worth at least 250 gp, attuned to a particular plane of existence)",
                "somatic": true,
                "verbal": true
            },
            "description": "You and up to eight willing creatures who link hands in a circle are transported to a different plane of existence. You can specify a target destination in general terms, such as the City of Brass on the Elemental Plane of Fire or the palace of Dispater on the second level of the Nine Hells, and you appear in or near that destination. If you are trying to reach the City of Brass, for example, you might arrive in is Street of Steel, before its Gate of Ashes, or looking at the city from across the Sea of Fire, at the DM's discretion.\n\nAlternatively, if you know the sigil sequence of a teleportation circle on another plane of existence, this spell can take you to that circle. If the teleportation circle is too small to hold all the creatures you transported, they appear in the closest unoccupied spaces next to the circle.\n\nYou can use this spell to banish an unwilling creature to another plane.  Chose a creature within your reach and make a melee spell attack against it. On a hit, the creature must make a Charisma saving throw. If the creature fails this save, it is transported to a random location on the plane of existence you specify. A creature so transported must find its own way back to your current plane of existence.",
            "duration": "Instantaneous",
            "level": "7",
            "name": "Plane Shift",
            "range": "Touch",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "cleric",
                "druid",
                "sorcerer",
                "warlock",
                "wizard",
                "level7"
            ],
            "type": "7th-level conjuration"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "bard",
                "cleric",
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a prayer wheel and holy water"
                ],
                "raw": "V, S, M (a prayer wheel and holy water)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a creature and stimulate its natural healing ability. The target regains 4d8 + 15 hit points. For the duration of the spell, the target regains 1 hit point at the start of each of its turns (10 hit points each minute).\n\nThe target's severed body members (fingers, legs, tails, and so on), if any, are restored after 2 minutes. If you have the severed part and hold it to the stump, the spell instantaneously causes the limb to knit to the stump.",
            "duration": "1 hour",
            "level": "7",
            "name": "Regenerate",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "level7"
            ],
            "type": "7th-level transmutation"
        },
        {
            "casting_time": "1 hour",
            "classes": [
                "bard",
                "cleric"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a diamond worth at least 1,000 gp, which the spell consumes"
                ],
                "raw": "V, S, M (a diamond worth at least 1,000 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a dead creature that has been dead for no more than a century, that didn't die of old age, and that isn't undead. If its soul is free and willing, the target returns to life with all its hit points.\n\nThis spell neutralizes any poisons and cures normal diseases afflicting the creature when it died. It doesn't however, remove magical diseases, curses, and the like; if such effects aren't removed prior to casting the spell, the afflict the target on its return to life.\n\nThis spell closes all mortal wounds and restores any missing body parts.\n\nComing back from the dead is an ordeal. The target takes a -4 penalty to all attack rolls, saving throws, and ability checks. Every time the target finishes a long rest, the penalty is reduced by 1 until it disappears.\n\nCasting this spell to restore life to a creature that has been dead for one year or longer taxes you greatly. Until you finish a long rest, you can't cast spells again, and you have disadvantage on all attack rolls, ability checks, and saving throws.",
            "duration": "Instantaneous",
            "level": "7",
            "name": "Resurrection",
            "range": "Touch",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "bard",
                "cleric",
                "level7"
            ],
            "type": "7th-level necromancy"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a lodestone and iron filings"
                ],
                "raw": "V, S, M (a lodestone and iron filings)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell reverses gravity in a 50-foot-radius, 100-foot high cylinder centered on a point within range. All creatures and objects that aren't somehow anchored to the ground in the area fall upward and reach the top of the area when you cast this spell. A creature can make a Dexterity saving throw to grab onto a fixed object it can reach, thus avoiding the fall.\n\nIf some solid object (such as a ceiling) is encountered in this fall, falling objects and creature strike it just as they would during a normal downward fall. If an object or creature reaches the top of the area without striking anything, it remains there, oscillating slightly, for the duration.\n\nAt the end of the duration, affected objects and creatures fall back down.",
            "duration": "Concentration, up to 1 minute",
            "level": "7",
            "name": "Reverse Gravity",
            "range": "100 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "level7"
            ],
            "type": "7th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a powder of diamond, emerald, rube and sapphire dust worth at least 5,000 gp, which the spell consumes"
                ],
                "raw": "V, S, M (a powder of diamond, emerald, rube and sapphire dust worth at least 5,000 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "By means of this spell, a willing creature or an object can be hidden away, safe from detection for the duration. When you cast the spell and touch the target, it becomes invisible and can't be targeted by divination spells or perceived through scrying sensors created by divination spells.\n\nIf the target is a creature, it falls into a state of suspended animation. Time ceases to flow for it, and it doesn't grow older.\n\nYou can set a condition for the spell to end early. The condition can be anything you choose, but it must occur or be visible within 1 mile of the target.  Examples include \"after 1,000 years\" or \"when the tarrasque awakens.\" This spell also ends if the target takes any damage.",
            "duration": "Until dispelled",
            "level": "7",
            "name": "Sequester",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "wizard",
                "level7"
            ],
            "type": "7th-level transmutation"
        },
        {
            "casting_time": "12 hours",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "snow or ice in quantities sufficient to made a life-size copy of the duplicated creature; some hair, fingernail clippings, or other piece of that creature's body placed inside the snow or ice; and powdered ruby worth 1,500 gp, sprinkled over the duplicate and consumed by the spell"
                ],
                "raw": "V, S, M (snow or ice in quantities sufficient to made a life-size copy of the duplicated creature; some hair, fingernail clippings, or other piece of that creature's body placed inside the snow or ice; and powdered ruby worth 1,500 gp, sprinkled over the duplicate and consumed by the spell)",
                "somatic": true,
                "verbal": true
            },
            "description": "You shape an illusory duplicate of one beast or humanoid that is within range for the entire casting time of the spell. The duplicate is a creature, partially real and formed from ice or snow, and it can take actions and otherwise be affected as a normal creature. It appears to be the same as the original, but it has half the creature's hit point maximum and is formed without any equipment. Otherwise, the illusion uses all the statistics of the creature it duplicates.\n\nThe simulacrum is friendly to you and creatures you designate. It obeys your spoken commands, moving and acting in accordance with your wishes and acting on your turn in combat. The simulacrum lacks the ability to learn or become more powerful, so it never increases its level or other abilities, nor can it regain expended spell slots.\n\nIf the simulacrum is damaged, you can repair it in an alchemical laboratory, using rare herbs and minerals worth 100gp per hit point it regains. The simulacrum lasts until it drops to 0 hit points, at which point it reverts to snow and melts instantly.\n\nIf you cast this spell again, any currently active duplicates you created with this spell are instantly destroyed.",
            "duration": "Until dispelled",
            "level": "7",
            "name": "Simulacrum",
            "range": "Touch",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "wizard",
                "level7"
            ],
            "type": "7th-level illusion"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "bard",
                "cleric",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "mercury, phosphorus, and powdered diamond and opal with a total value of at least 1,000 gp, which the spell consumes"
                ],
                "raw": "V, S, M (mercury, phosphorus, and powdered diamond and opal with a total value of at least 1,000 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "When you cast this spell, you inscribe a harmful glyph either on a surface (such as a section of floor, a wall, or a table) or within an object that can be closed to conceal the glyph (such as a book, a scroll, or a treasure chest). If you choose a surface, the glyph can cover an area of the surface no larger than 10 feet in diameter. If you choose an object, that object must remain in its place; if the object is moved more than 10 feet from where you cast this spell, the glyph is broken, and the spell ends without being triggered.\n\nThe glyph is nearly invisible, requiring an Intelligence (Investigation) check against your spell save DC to find it.\n\nYou decide what triggers the glyph when you cast the spell. For glyphs inscribed on a surface, the most typical triggers include touching or stepping on the glyph, removing another object covering it, approaching within a certain distance of it, or manipulating the object that holds it. For glyphs inscribed within an object, the most common triggers are opening the object, approaching within a certain distance of it, or seeing or reading the glyph.\n\nYou can further refine the trigger so the spell is activated only under certain circumstances or according to a creature's physical characteristics (such as height or weight), or physical kind (for example, the ward could be set to affect hags or shapechangers). You can also specify creatures that don't trigger the glyph, such as those who say a certain password.\n\nWhen you inscribe the glyph, choose one of the options below for its effect. Once triggered, the glyph glows, filling a 60-foot-radius sphere with dim light for 10 minutes, after which time the spell ends. Each creature in the sphere when the glyph activate is targeted by its effect, as is a creature that enters the sphere for the first time on a turn or ends its turn there.\n\nDeath: Each target must make a Constitution saving throw, taking 10d10 necrotic damage on a failed save, or half as much damage on a successful save.\n\nDiscord: Each target must make a Constitution saving throw. On a failed save, a target bickers and argues with other creatures for 1 minute. During this time, it is incapable of meaningful Communication and has disadvantage on Attack Rolls and Ability Checks.\n\nFear: Each target must make a Wisdom saving throw and becomes Frightened for 1 minute on a failed save. While Frightened, the target drops whatever it is holding and must move at least 30 feet away from the glyph on each of its turns, if able.\n\nHopelessness: Each target must make a Charisma saving throw. On a failed save, the target is overwhelmed with despair for 1 minute. During this time, it can't Attack or target any creature with harmful Abilities, Spells, or other magical Effects.\n\nInsanity: Each target must make an Intelligence saving throw. On a failed save, the target is driven insane for 1 minute. An insane creature can't take Actions, can't understand what other creatures say, can't read, and speaks only in gibberish. The DM controls its Movement, which is erratic.\n\nPain: Each target must make a Constitution saving throw and becomes Incapacitated with excruciating pain for 1 minute on a failed save.\n\nSleep: Each target must make a Wisdom saving throw and falls Unconscious for 10 minutes on a failed save. A creature awakens if it takes damage or if someone uses an action to shake or slap it awake.\n\nStunning: Each target must make a Wisdom saving throw and becomes Stunned for 1 minute on a failed save.",
            "duration": "Until dispelled or triggered",
            "level": "7",
            "name": "Symbol",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "bard",
                "cleric",
                "wizard",
                "level7"
            ],
            "type": "7th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "This spell instantly transports you and up to eight willing creatures of your choice that you can see within range, or a single object, that you can see within range, to a destination you select. If you target an object, it must be able to fit entirely inside a 10-foot cube, and it can't be held or carried by an unwilling creature.\n\nThe destination you choose must be known to you, and it must be on the same plane of existence as you. Your familiarity with the destination determines whether you arrive there successfully. The DM rolls d100 and consults the table.\n\n| Familiarity       | Mishap | Simliar Area | Off Target | On Target |\n|-------------------|--------|--------------|------------|-----------|\n| Permanent circle  |  ---   |      ---     |     ---    |   01-100  |\n| Associated object |  ---   |      ---     |     ---    |   01-100  |\n| Very familiar     | 01-05  |     06-13    |    14-24   |   25-100  |\n| Seen casually     | 01-33  |     34-43    |    44-53   |   54-100  |\n| Viewed once       | 01-43  |     44-53    |    54-73   |   74-100  |\n| Description       | 01-43  |     44-53    |    54-73   |   74-100  |\n| False destination | 01-50  |    51-100    |     ---    |    ---    |\n\nFamiliarity: \"Permanent Circle\" means a permanent Teleportation Circle whose sigil sequence you know. \"Associated Object\" means that you possess an object taken from the desired destination within the last six months, such as a book from a wizard's Library, bed linen from a royal suite, or a chunk of marble from a Lich's Secret tomb.\n\"Very familiar\" is a place you have been very often, a place you have carefully studied, or a place you can see when you cast the spell. \"Seen casually\" is someplace you have seen more than once but with which you aren't very familiar. \"Viewed once\" is a place you have seen once, possibly using magic. \"Description\" is a place whose location and appearance you know through someone else's description, perhaps from a map.\n\"False destination\" is a place that doesn't exist. Perhaps you tried to scry an enemy's sanctum but instead view an illusion, or you were attempting to teleport to a familiar location that no longer exists.\n\nOn Target: You and your group (or the target object) appear where you want to go.\n\nOff Target: You and your group (or the target object) appear a random distance away from the destination in a random direction. Distance off target is 1d10 x 1d10 percent of the distance that was to be travelled. For example, if you tried to Travel 120 miles, landed off target, and rolled a 5 and 3 on the two d10s, then you would be off target by 15 percent, or 18 miles. The DM determines the direction off target randomly by rolling a d8 and designating 1 as north, 2 as north-east, 3 as east, and so on around the points of the compass. If you were teleporting to a Coastal city and wound up 18 miles out at sea, you could be in trouble.\n\nSimilar Area: You and your group (or the target object) wind up in a different area that's visually or thematically similar to the target area. If you are heading for your home laboratory, for example, you might wind up in another wizard's laboratory or in an alchemical supply shop that has many of the same tools and implements as your laboratory. Generally, you appear in the closest similar place, but since the spell has no range limit, you could conceivably wind up anywhere on the plane.\n\nMishap: The spell's unpredictable magic results in a difficult journey. Each teleporting creature (or the target object) takes 3d10 force damage and the DM rerolls on the table to see where you wind up (multiple Mishaps can occur, dealing damage each time).",
            "duration": "Instantaneous",
            "level": "7",
            "name": "Teleport",
            "range": "10 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "level7"
            ],
            "type": "7th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a snake's tongue and either a bit of honeycomb or a drop of sweet oil"
                ],
                "raw": "V, M (a snake's tongue and either a bit of honeycomb or a drop of sweet oil)",
                "somatic": false,
                "verbal": true
            },
            "description": "You suggest a course of activity (limited to a sentence or two) and magically influence a creature you can see within range that can hear and understand you. Creatures that can't be charmed are immune to this effect. The suggestion must be worded in such a manner as to make the course of action sound reasonable. Asking the creature to stab itself, throw itself onto a spear, immolate itself, or do some other obviously harmful act ends the spell.\n\nThe target must make a Wisdom saving throw. On a failed save, it pursues the course of action you described to the best of its ability. The suggested course of action can continue for the entire duration. If the suggested activity can be completed in a shorter time, the spell ends when the subject finishes what it was asked to do.\n\nYou can also specify conditions that will trigger a special activity during the duration. For example, you might suggest that a knight give her warhorse to the first beggar she meets. If the condition isn't met before the spell expires, the activity isn't performed.\n\nIf you or any of your companions damage the target, the spell ends.",
            "duration": "Concentration, up to 8 hours",
            "level": "2",
            "name": "Suggestion",
            "range": "30 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level2"
            ],
            "type": "2nd-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "an eyelash encased in gum arabic"
                ],
                "raw": "V, S, M (an eyelash encased in gum arabic)",
                "somatic": true,
                "verbal": true
            },
            "description": "A creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person. The spell ends for a target that attacks or casts a spell.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.",
            "level": "2",
            "name": "Invisibility",
            "range": "Touch",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level2"
            ],
            "type": "2nd-level illusion"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Objects come to life at your command. Choose up to ten nonmagical objects within range that are not being worn or carried. Medium targets count as two objects, Large targets count as four objects, Huge targets count as eight objects. You can't animate any object larger than Huge. Each target animates and becomes a creature under your control until the spell ends or until reduced to 0 hit points.\n\nAs a bonus action, you can mentally command any creature you made with this spell if the creature is within 500 feet of you (if you control multiple creatures, you can command any or all of them at the same time, issuing the same command to each one). You decide what action the creature will take and where it will move during its next turn, or you can issue a general command, such as to guard a particular chamber or corridor. If you issue no commands, the creature only defends itself against hostile creatures. Once given an order, the creature continues to follow it until its task is complete.\n\n| Size   | HP | AC | Attack                   | Str | Dex |\n|---|---|---|---|---|---|\n| Tiny   | 20 | 18 | +8 to hit, 1d4+4 damage  |   4 |  18 |\n| Small  | 25 | 16 | +6 to hit, 1d8+2 damage  |   6 |  14 |\n| Medium | 40 | 13 | +5 to hit, 2d6+1 damage  |  10 |  12 |\n| Large  | 50 | 10 | +6 to hit, 2d10+2 damage |  14 |  10 |\n| Huge   | 80 | 10 | +8 to hit, 2d12+2 damage |  18 |   6 |\n\nAn animated object is a construct with AC, hit points, attacks, Strength, and Dexterity determined by its size. Its Constitution is 10 and its Intelligence and Wisdom are 3, and its Charisma is 1. Its speed is 30 feet; if the object lacks legs or other appendages it can use for locomotion, it instead has a flying speed of 30 feet and can hover. If the object is securely attached to a surface or a larger object, such as a chain bolted to a wall, its speed is 0. It has blindsight with a radius of 30 feet and is blind beyond that distance. When the animated object drops to 0 hit points, it reverts to its original object form, and any remaining damage carries over to its original object form.\n\nIf you command an object to attack, it can make a single melee attack against a creature within 5 feet of it. It makes a slam attack with an attack bonus and bludgeoning damage determined by its size. The DM might rule that a specific object inflicts slashing or piercing damage based on its form.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "If you cast this spell using a spell slot of 6th level or higher, you can animate two additional objects for each slot level above 5th.",
            "level": "5",
            "name": "Animate Objects",
            "range": "120 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "level5"
            ],
            "type": "ANIMATED OBJECTS STATISTICS"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A shimmering barrier extends out from you in a 10-foot radius and moves with you, remaining centered on you and hedging out creatures other than undead and constructs. The barrier lasts for the duration.\n\nThe barrier prevents an affected creature from passing or reaching through. An affected creature can cast spells or make attacks with ranged or reach weapons through the barrier.\n\nIf you move so an affected creature is forced to pass through the barrier, the spell ends.",
            "duration": "Concentration, up to 1 hour",
            "level": "5",
            "name": "Antilife Shell",
            "range": "Self (10-foot radius)",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "druid",
                "level5"
            ],
            "type": "5th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You create linked teleportation portals that remain open for the duration. Choose two points on the ground that you can see, one point within 10 feet of you and one point within 500 feet of you. A circular portal, 10 feet in diameter, opens over each point. If the portal would open in the space occupied by a creature, the spell fails, and the casting is lost.\n\nThe portals are two-dimensional glowing rings filled with mist, hovering inches from the ground and perpendicular to it at the points you choose. A ring is visible only from one side (your choice), which is the side that functions as a portal.\n\nAny creature or object entering the portal exits from the other portal as if the two were adjacent to each other; passing through a portal from the nonportal side has no effect. The mist that fills each portal is opaque and blocks vision through it. On your turn, you can rotate the rings as a bonus action so that the active side faces in a different direction.",
            "duration": "Concentration, up to 10 minutes",
            "level": "6",
            "name": "Arcane Gate",
            "range": "500 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "sorcerer",
                "warlock",
                "wizard",
                "level6"
            ],
            "type": "6th-level conjuration"
        },
        {
            "casting_time": "8 hours",
            "classes": [
                "bard",
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "an agate worth at least 1000 gp, which the spell consumes"
                ],
                "raw": "V, S, M (an agate worth at least 1000 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "After spending the casting time tracing magical pathways within a precious gemstone, you touch a Huge or smaller beast or plant. The target must have either no Intelligence score or an Intelligence of 3 or less. The target gains an Intelligence of 10. The target also gains the ability to speak one language you know. If the target is a plant, it gains the ability to move its limbs, roots, vines, creepers, and so forth, and it gains senses similar to a human's. Your DM chooses statistics appropriate for the awakened plant, such as the statistics for the awakened shrub or the awakened tree.\n\nThe awakened beast or plant is charmed by you for 30 days or until you or your companions do anything harmful to it. When the charmed condition ends, the awakened creature chooses whether to remain friendly to you, based on how you treated it while it was charmed.",
            "duration": "Instantaneous",
            "level": "5",
            "name": "Awaken",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "druid",
                "level5"
            ],
            "type": "5th-level transmutation"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "The next time you hit a creature with a weapon attack before this spell ends, your weapon crackles with force, and the attack deals an extra 5d10 force damage to the target. Additionally, if this attack reduces the target to 50 hit points or fewer, you banish it. If the target is native to a different plane of existence than the one you're on, the target disappears, returning to its home plane. If the target is native to the plane you're on, the creature vanishes into a harmless demiplane. While there, the target is incapacitated. It remains there until the spell ends, at which point the target reappears in the space it left or in the nearest unoccupied space if that space is occupied.",
            "duration": "Concentration, up to 1 minute",
            "level": "5",
            "name": "Banishing Smite",
            "range": "Self",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "paladin",
                "level5"
            ],
            "type": "5th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of fur; a piece of amber, glass or a crystal rod; and three silver pins"
                ],
                "raw": "V, S, M (a bit of fur; a piece of amber, glass or a crystal rod; and three silver pins)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a bolt of lightning that arcs toward a target of your choice that you can see within range. Three bolts then leap from that target to as many as three other targets, each of which must be within 30 feet of the first target. A target can be a creature or an object and can be targeted by only one of the bolts.\n\nA target must make a Dexterity saving throw. The target takes 10d8 lightning damage on a failed save, or half as much damage on a successful one.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 7th level or higher, one additional bolt leaps from the first target to another target for each slot level above 6th.",
            "level": "6",
            "name": "Chain Lightning",
            "range": "150 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "level6"
            ],
            "type": "6th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a vertical wall of whirling, razor-sharp blades made of magical energy. The wall appears within range and lasts for the duration. You can make a straight wall up to 100 feet long, 20 feet high, and 5 feet thick, or a ringed wall up to 60 feet in diameter, 20 feet high, and 5 feet thick. The wall provides three-quarters cover to creatures behind it, and its space is difficult terrain.\n\nWhen a creature enters the wall's area for the first time on a turn or starts its turn there, the creature must make a Dexterity saving throw. On a failed save, the creature takes 6d10 slashing damage. On a successful save, the creature takes half as much damage.",
            "duration": "Concentration, up to 10 minutes",
            "level": "6",
            "name": "Blade Barrier",
            "range": "90 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "cleric",
                "level6"
            ],
            "type": "6th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "the powder of a crushed black pearl worth at least 500 gp"
                ],
                "raw": "V, S, M (the powder of a crushed black pearl worth at least 500 gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "A sphere of negative energy ripples out in a 60-foot- radius sphere from a point within range. Each creature in that area must make a Constitution saving throw. A target takes 8d6 necrotic damage on a failed save, or half as much damage on a successful one.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 7th level or higher, the damage increases by 2d6 for each slot level above 6th.",
            "level": "6",
            "name": "Circle of Death",
            "range": "150 feet",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "sorcerer",
                "warlock",
                "wizard",
                "level6"
            ],
            "type": "6th-level necromancy"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "Divine energy radiates from you, distorting and diffusing magical energy within 30 feet of you. Until the spell ends, the sphere moves with you, centered on you. For the duration, each friendly creature in the area (including you) has advantage on saving throws against spells and other magical effects. Additionally, when an affected creature succeeds on a saving throw made against a spell or magical effect that allows it to make a saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw.",
            "duration": "Concentration, up to 10 minutes",
            "level": "5",
            "name": "Circle of Power",
            "range": "Self (30-foot radius)",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "paladin",
                "level5"
            ],
            "type": "5th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a 20-foot-radius sphere of poisonous, yellow-green fog centered on a point you choose within range. The fog spreads around corners. It lasts for the duration or until strong wind disperses the fog, ending the spell. Its area is heavily obscured.\n\nWhen a creature enters the spell's area for the first time on a turn or starts its turn there, that creature must make a Constitution saving throw. The creature takes 5d8 poison damage on a failed save, or half as much damage on a successful one. Creatures are affected even if they hold their breath or don't need to breathe.\n\nThe fog moves 10 feet away from you at the start of each of your turns, rolling along the surface of the ground. The vapors, being heavier than air, sink to the lowest level of the land, even pouring down openings.",
            "duration": "Concentration, up to 10 minutes",
            "higher_levels": "When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th.",
            "level": "5",
            "name": "Cloudkill",
            "range": "120 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "sorcerer",
                "wizard",
                "level5"
            ],
            "type": "5th-level conjuration"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "druid",
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You briefly become one with nature and gain knowledge of the surrounding territory. In the outdoors, the spell gives you knowledge of the land within 3 miles of you. In caves and other natural underground settings, the radius is limited to 300 feet. The spell doesn't function where nature has been replaced by construction, such as in dungeons and towns.  You instantly gain knowledge of up to three facts of your choice about any of the following subjects as they relate to the area:\n\n* terrain and bodies of water\n\n* prevalent plants, minerals, animals, or peoples\n\n* powerful celestials, fey, fiends, elementals, or undead\n\n* influence from other planes of existence\n\n* buildings\n\nFor example, you could determine the location of powerful undead in the area, the location of major sources of safe drinking water, and the location of any nearby towns.",
            "duration": "Instantaneous",
            "level": "5",
            "name": "Commune with Nature",
            "range": "Self",
            "ritual": true,
            "school": "divination",
            "tags": [
                "druid",
                "ranger",
                "level5"
            ],
            "type": "5th-level divination (ritual)"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "incense and a vial of holy or unholy water"
                ],
                "raw": "V, S, M (incense and a vial of holy or unholy water)",
                "somatic": true,
                "verbal": true
            },
            "description": "You contact your deity or a divine proxy and ask up to three questions that can be answered with a yes or no. You must ask your questions before the spell ends. You receive a correct answer for each question.\n\nDivine beings aren't necessarily omniscient, so you might receive \"unclear\" as an answer if a question pertains to information that lies beyond the deity's knowledge. In a case where a one-word answer could be misleading or contrary to the deity's interests, the DM might offer a short phrase as an answer instead.\n\nIf you cast the spell two or more times before finishing your next long rest, there is a cumulative 25 percent chance for each casting after the first that you get no answer. The DM makes this roll in secret.",
            "duration": "1 minute",
            "level": "5",
            "name": "Commune",
            "range": "Self",
            "ritual": true,
            "school": "divination",
            "tags": [
                "cleric",
                "level5"
            ],
            "type": "5th-level divination (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a small crystal or a glass cone"
                ],
                "raw": "V, S, M (a small crystal or a glass cone)",
                "somatic": true,
                "verbal": true
            },
            "description": "A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much damage on a successful one.\n\nA creature killed by this spell becomes a frozen statue until it thaws.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th.",
            "level": "5",
            "name": "Cone of Cold",
            "range": "Self (60-foot cone)",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "level5"
            ],
            "type": "5th-level evocation"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "druid",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "burning incense for air, soft clay for earth, sulfur and phosphorus for fire, or water and sand for water"
                ],
                "raw": "V, S, M (burning incense for air, soft clay for earth, sulfur and phosphorus for fire, or water and sand for water)",
                "somatic": true,
                "verbal": true
            },
            "description": "You call forth an elemental servant. Choose an area of air, earth, fire, or water that fills a 10-foot cube within range. An elemental of challenge rating 5 or lower appropriate to the area you chose appears in an unoccupied space within 10 feet of it. For example, a fire elemental emerges from a bonfire, and an earth elemental rises up from the ground. The elemental disappears when it drops to 0 hit points or when the spell ends.\n\nThe elemental is friendly to you and your companions for the duration. Roll initiative for the elemental, which has its own turns. It obeys any verbal commands that you issue to it (no action required by you). If you don't issue any commands to the elemental, it defends itself from hostile creatures but otherwise takes no actions.\n\nIf your concentration is broken, the elemental doesn't disappear. Instead, you lose control of the elemental, it becomes hostile toward you and your companions, and it might attack. An uncontrolled elemental can't be dismissed by you, and it disappears 1 hour after you summoned it.\n\nThe DM has the elemental's statistics.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell using a spell slot of 6th level or higher, the challenge rating increases by 1 for each slot level above 5th.",
            "level": "5",
            "name": "Conjure Elemental",
            "range": "90 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "wizard",
                "level5"
            ],
            "type": "5th-level conjuration"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "druid",
                "warlock"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You summon a fey creature of challenge rating 6 or lower, or a fey spirit that takes the form of a beast of challenge rating 6 or lower. It appears in an unoccupied space that you can see within range. The fey creature disappears when it drops to 0 hit points or when the spell ends.\n\nThe fey creature is friendly to you and your companions for the duration. Roll initiative for the creature, which has its own turns. It obeys any verbal commands that you issue to it (no action required by you), as long as they don't violate its alignment. If you don't issue any commands to the fey creature, it defends itself from hostile creatures but otherwise takes no actions.\n\nIf your concentration is broken, the fey creature doesn't disappear. Instead, you lose control of the fey creature, it becom es hostile toward you and your companions, and it might attack. An uncontrolled fey creature can't be dismissed by you, and it disappears 1 hour after you summoned it.\n\nThe DM has the fey creature's statistics.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell using a spell slot of 7th level or higher, the challenge rating increases by 1 for each slot level above 6th.",
            "level": "6",
            "name": "Conjure Fey",
            "range": "90 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "warlock",
                "level6"
            ],
            "type": "6th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "one piece of ammunition or one throwing weapon"
                ],
                "raw": "V, S, M (one piece of ammunition or one throwing weapon)",
                "somatic": true,
                "verbal": true
            },
            "description": "You fire a piece of nonmagical ammunition from a ranged weapon or throw a nonmagical weapon into the air and choose a point within range. Hundreds of duplicates of the ammunition or weapon fall in a volley from above and then disappear. Each creature in a 40-foot-radius, 20-foot-high cylinder centered on that point must make a Dexterity saving throw. A creature takes 8d8 damage on a failed save, or half as much damage on a successful one. The damage type is the same as that of the ammunition or weapon.",
            "duration": "Instantaneous",
            "level": "5",
            "name": "Conjure Volley",
            "range": "150 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "ranger",
                "level5"
            ],
            "type": "5th-level Conjuration"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You mentally contact a demigod, the spirit of a long-dead sage, or some other mysterious entity from another plane. Contacting this extraplanar intelligence can strain or even break your mind. When you cast this spell, make a DC 15 Intelligence saving throw. On a failure, you take 6d6 psychic damage and are insane until you finish a long rest. While insane, you can't take actions, can't understand what other creatures say, can't read, and speak only in gibberish. A *[greater restoration](../greater-restoration \"greater restoration (lvl 5)\")* spell cast on you ends this effect.\n\nOn a successful save, you can ask the entity up to five questions. You must ask your questions before the spell ends. The DM answers each question with one word, such as \"yes,\" \"no,\" \"maybe,\" \"never,\" \"irrelevant,\" or \"unclear\" (if the entity doesn't know the answer to the question). If a one-word answer would be misleading, the DM might instead offer a short phrase as an answer.",
            "duration": "1 minute",
            "level": "5",
            "name": "Contact Other Plane",
            "range": "Self",
            "ritual": true,
            "school": "divination",
            "tags": [
                "warlock",
                "wizard",
                "level5"
            ],
            "type": "5th-level divination (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Your touch inflicts disease. Make a melee spell attack against a creature within your reach. On a hit, you afflict the creature with a disease of your choice from any of the ones described below.\n\nAt the end of each of the target's turns, it must make a Constitution saving throw. After failing three of these saving throws, the disease's effects last for the duration, and the creature stops making these saves. After succeeding on three of these saving throws, the creature recovers from the disease, and the spell ends.\n\nSince this spell induces a natural disease in its target, any effect that removes a disease or otherwise ameliorates a disease's effects apply to it.\n\n* Blinding Sickness: Pain grips the creature's mind, and its eyes turn milky white. The creature has disadvantage on Wisdom Checks and Wisdom Saving Throws and is Blinded.\n* Filth Fever: A raging fever sweeps through the creature's body. The creature has disadvantage on Strength Checks, Strength Saving Throws, and Attack Rolls that use Strength.\n* Flesh Rot: The creature's flesh decays. The creature has disadvantage on Charisma Checks and vulnerability to all damage.\n* Mindfire: The creature's mind becomes feverish. The creature has disadvantage on Intelligence Checks and Intelligence Saving Throws, and the creature behaves as if under the Effects of the Confusion spell during Combat.\n* Seizure: The creature is overcome with shaking. The creature has disadvantage on Dexterity Checks, Dexterity Saving Throws, and Attack Rolls that use Dexterity.\n* Slimy Doom: The creature begins to bleed uncontrollably. The creature has disadvantage on Constitution Checks and Constitution Saving Throws. In addition, whenever the creature takes damage, it is Stunned until the end of its next turn.",
            "duration": "7 days",
            "level": "5",
            "name": "Contagion",
            "range": "Touch",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "cleric",
                "druid",
                "level5"
            ],
            "type": "5th-level necromancy"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a statuette of yourself carved from ivory and decorated with gems worth at least 1,500 gp"
                ],
                "raw": "V, S, M (a statuette of yourself carved from ivory and decorated with gems worth at least 1,500 gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "Choose a spell of 5th level or lower that you can cast, that has a casting time of 1 action, and that can target you. You cast that spell--called the contingent spell--as part of casting *contingency*, expending spell slots for both, but the contingent spell doesn't come into effect. Instead, it takes effect when a certain circumstance occurs. You describe that circumstance when you cast the two spells. For example, a *contingency* cast with *[water breathing](../water-breathing/ \"water breathing (lvl 3)\")* might stipulate that *water breathing* comes into effect when you are engulfed in water or a similar liquid.\n\nThe contingent spell takes effect immediately after the circumstance is met for the first time, whether or not you want it to. and then contingency ends.\n\nThe contingent spell takes effect only on you, even if it can normally target others. You can use only one *contingency* spell at a time. If you cast this spell again, the effect of another *contingency* spell on you ends. Also, *contingency* ends on you if its material component is ever not on your person.",
            "duration": "10 days",
            "level": "6",
            "name": "Contingency",
            "range": "Self",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "wizard",
                "level6"
            ],
            "type": "6th-level evocation"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "cleric",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "one clay pot filled with grave dirt, one clay pot filled with brackish water, and one 150 gp black onyx stone for each corpse"
                ],
                "raw": "V, S, M (one clay pot filled with grave dirt, one clay pot filled with brackish water, and one 150 gp black onyx stone for each corpse)",
                "somatic": true,
                "verbal": true
            },
            "description": "You can cast this spell only at night. Choose up to three corpses of Medium or Small humanoids within range. Each corpse becomes a ghoul under your control. (The DM has game statistics for these creatures.)\n\nAs a bonus action on each of your turns, you can mentally command any creature you animated with this spell if the creature is within 120 feet of you (if you control multiple creatures, you can command any or all of them at the same time, issuing the same command to each one). You decide what action the creature will take and where it will move during its next turn, or you can issue a general command, such as to guard a particular chamber or corridor. If you issue no commands, the creature only defends itself against hostile creatures. Once given an order, the creature continues to follow it until its task is complete.\n\nThe creature is under your control for 24 hours, after which it stops obeying any command you have given it. To maintain control of the creature for another 24 hours, you must cast this spell on the creature before the current 24-hour period ends. This use of the spell reasserts your control over up to three creatures you have animated with this spell, rather than animating new ones.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a 7th-level spell slot, you can animate or reassert control over four ghouls. When you cast this spell using an 8th-level spell slot, you can animate or reassert control over five ghouls or two ghasts or wights. When you cast this spell using a 9th-level spell slot, you can animate or reassert control over six ghouls, three ghasts or wights, or two mummies.",
            "level": "6",
            "name": "Create Undead",
            "range": "10 feet",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "cleric",
                "warlock",
                "wizard",
                "level6"
            ],
            "type": "6th-level necromancy"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "ruby dust worth 50 gp, which the spell consumes"
                ],
                "raw": "V, S, M (ruby dust worth 50 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "A flame, equivalent in brightness to a torch, springs forth from an object that you touch. The effect looks like a regular flame, but it creates no heat and doesn't use oxygen. A *continual flame* can be covered or hidden but not smothered or quenched.",
            "duration": "Until dispelled",
            "level": "2",
            "name": "Continual Flame",
            "range": "Self",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "cleric",
                "wizard",
                "level2"
            ],
            "type": "2nd-level evocation"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a tiny piece of matter of the same type of the item you plan to create"
                ],
                "raw": "V, S, M (a tiny piece of matter of the same type of the item you plan to create)",
                "somatic": true,
                "verbal": true
            },
            "description": "You pull wisps of Shadow material from the Shadowfell to create a nonliving object of vegetable matter within range - soft goods, rope, wood, or something similar. You can also use this spell to create mineral Objects such as stone, Crystal, or metal. The object created must be no larger than a 5-foot cube, and the object must be of a form and material that you have seen before.\nThe duration depends on the object's material. If the object is composed of multiple materials, use the shortest duration.\n\n| Material              | Duration   |\n|---|---|\n| Vegetable matter      | 1 day      |\n| Stone or crystal      | 12 hours   |\n| Precious metals       | 1 hour     |\n| Gems                  | 10 minutes |\n| Adamantine or mithral | 1 minute   |\n\nUsing any material created by this spell as another spell's material component causes that spell to fail.",
            "duration": "Special",
            "higher_levels": "When you cast this spell using a spell slot of 6th level or higher, the cube increases by 5 feet for each slot level above 5th.",
            "level": "5",
            "name": "Creation",
            "range": "30 feet",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "sorcerer",
                "wizard",
                "level5"
            ],
            "type": "5th-level illusion"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You strike the ground, creating a burst of divine energy that ripples outward from you. Each creature you choose within 30 feet of you must succeed on a Constitution saving throw or take 5d6 thunder damage, as well as 5d6 radiant or necrotic damage (your choice), and be knocked prone. A creature that succeeds on its saving throw takes half as much damage and isn't knocked prone.",
            "duration": "Instantaneous",
            "level": "5",
            "name": "Destructive Wave",
            "range": "Self (30-foot radius)",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "paladin",
                "level5"
            ],
            "type": "5th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a lodestone and a pinch of dust"
                ],
                "raw": "V, S, M (a lodestone and a pinch of dust)",
                "somatic": true,
                "verbal": true
            },
            "description": "A thin green ray springs from your pointing finger to a target that you can see within range. The target can be a creature, an object, or a creation of magical force, such as the wall created by *[wall of force](../wall-of-force/ \"wall of force (lvl 5)\")*.\n\nA creature targeted by this spell must make a Dexterity saving throw. On a failed save, the target takes 10d6 + 40 force damage. If this damage reduces the target to 0 hit points, it is disintegrated.\n\nA disintegrated creature and everything it is wearing and carrying, except magic items, are reduced to a pile of fine gray dust. The creature can be restored to life only by means of a *[true resurrection](../true-resurrection/ \"true resurrection (lvl 9)\")* or a *[wish](../wish/ \"wish (lvl 9)\")* spell.\n\nThis spell automatically disintegrates a Large or smaller nonmagical object or a creation of magical force. If the target is a Huge or larger object or creation of force, this spell disintegrates a 10-foot-cube portion of it. A magic item is unaffected by this spell.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 7th level or higher, the damage increases by 3d6 for each slot level above 6th.",
            "level": "6",
            "name": "Disintegrate",
            "range": "60 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "wizard",
                "level6"
            ],
            "type": "6th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "incense and a sacrificial offering appropriate to your religion, together worth at least 25 gp, which the spell consumes"
                ],
                "raw": "V, S, M (incense and a sacrificial offering appropriate to your religion, together worth at least 25 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "Your magic and an offering put you in contact with a god or a god's servants. You ask a single question concerning a specific goal, event, or activity to occur within 7 days. The DM offers a truthful reply. The reply might be a short phrase, a cryptic rhyme, or an omen.\n\nThe spell doesn't take into account any possible circumstances that might change the outcome, such as the casting of additional spells or the loss or gain of a companion.\n\nIf you cast this spell two or more times before finishing your next long rest, there is a cumulative 25 percent chance for each casting after the first that you get a random reading. The DM makes this roll in secret.",
            "duration": "Instantaneous",
            "level": "4",
            "name": "Divination",
            "range": "Self",
            "ritual": true,
            "school": "divination",
            "tags": [
                "cleric",
                "level4"
            ],
            "type": "4th-level divination (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "paladin"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "holy water or powdered silver and iron"
                ],
                "raw": "V, S, M (holy water or powdered silver and iron)",
                "somatic": true,
                "verbal": true
            },
            "description": "Shimmering energy surrounds and protects you from fey, undead, and creatures originating from beyond the Material Plane. For the duration, celestials, elementals, fey, fiends, and undead have disadvantage on attack rolls against you.\n\nYou can end the spell early by using either of the following special functions.\n\n* Break Enchantment. As your action, you touch a creature you can reach that is charmed, frightened, or possessed by a celestial, an elemental, a fey, a fiend, or an undead. The creature you touch is no longer charmed, frightened, or possessed by such creatures.\n* Dismissal. As your action, make a melee spell attack against a celestial, an elemental, a fey, a fiend, or an undead you can reach. On a hit, you attempt to drive the creature back to its home plane. The creature must succeed on a Charisma saving throw or be sent back to its home plane (if it isn’t there already). If they are already on their home plane, undead are sent to the Shadowfell, and fey are sent to the Feywild.",
            "duration": "Concentration, up to 1 minute",
            "level": "5",
            "name": "Dispel Evil and Good",
            "range": "Self",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "paladin",
                "level5"
            ],
            "type": "5th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You attempt to beguile a beast that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw.\n\nWhile the beast is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence. You can use this telepathic link to issue commands to the creature while you are conscious (no action required), which it does its best to obey. You can specify a simple and general course of action, such as \"Attack that creature\", \"Run over there\", or \"Fetch that object\". If the creature completes the order and doesn't receive further direction from you, it defends and preserves itself to the best of its ability.\n\nYou can use your action to take total and precise control of the target. Until the end of your next turn, the creature takes only the actions you choose, and doesn't do anything that you don't allow it to do. During this time, you can also cause the creature to use a reaction, but this requires you to use your own reaction as well. Each time the target takes damage, it makes a new Wisdom saving throw against the spell. If the saving throw succeeds, the spell ends.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell with a 5th-level spell slot, the duration is concentration, up to 10 minutes. When you use a 6th-level spell slot, the duration is concentration, up to 1 hour. When you use a spell slot of 7th level or higher, the duration is concentration, up to 8 hours.",
            "level": "4",
            "name": "Dominate Beast",
            "range": "60 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "druid",
                "sorcerer",
                "level4"
            ],
            "type": "4th-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You attempt to beguile a humanoid that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw.\n\nWhile the target is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence. You can use this telepathic link to issue commands to the creature while you are conscious (no action required), which it does its best to obey. You can specify a simple and general course of action, such as \"Attack that creature\", \"Run over there\", or \"Fetch that object\". If the creature completes the order and doesn't receive further direction from you, it defends and preserves itself to the best of its ability.\n\nYou can use your action to take total and precise control of the target. Until the end of your next turn, the creature takes only the actions you choose, and doesn't do anything that you don't allow it to do. During this time you can also cause the creature to use a reaction, but this requires you to use your own reaction as well. Each time the target takes damage, it makes a new Wisdom saving throw against the spell. If the saving throw succeeds, the spell ends.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a 6th-level spell slot, the duration is concentration, up to 10 minutes. When you use a 7th-level spell slot, the duration is concentration, up to 1 hour. When you use a spell slot of 8th level or higher, the duration is concentration, up to 8 hours.",
            "level": "5",
            "name": "Dominate Person",
            "range": "60 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "level5"
            ],
            "type": "5th-level enchantment"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "bard",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a handful of sand, a dab of ink, and a writing quill plucked from a sleeping bird"
                ],
                "raw": "V, S, M (a handful of sand, a dab of ink, and a writing quill plucked from a sleeping bird)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell shapes a creature's dreams. Choose a creature known to you as the target of this spell. The target must be on the same plane of existence as you. Creatures that don't sleep, such as elves, can't be contacted by this spell. You, or a willing creature you touch, enters a trance state, acting as a messenger. While in the trance, the messenger is aware of his or her surroundings, but can't take actions or move.\n\nIf the target is asleep, the messenger appears in the target's dreams and can converse with the target as long as it remains asleep, through the duration of the spell. The messenger can also shape the environment of the dream, creating landscapes, objects, and other images. The messenger can emerge from the trance at any time, ending the effect of the spell early. The target recalls the dream perfectly upon waking. If the target is awake when you cast the spell, the messenger knows it, and can either end the trance (and the spell) or wait for the target to fall asleep, at which point the messenger appears in the target's dreams.\n\nYou can make the messenger appear monstrous and terrifying to the target. If you do, the messenger can deliver a message of no more than ten words and then the target must make a Wisdom saving throw. On a failed save, echoes of the phantasmal monstrosity spawn a nightmare that lasts the duration of the target's sleep and prevents the target from gaining any benefit from that rest. In addition, when the target wakes up, it takes 3d6 psychic damage.\n\nIf you have a body part, lock of hair, clipping from a nail, or similar portion of the target's body, the target makes its saving throw with disadvantage.",
            "duration": "8 hours",
            "level": "5",
            "name": "Dream",
            "range": "Special",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "warlock",
                "wizard",
                "level5"
            ],
            "type": "5th-level illusion"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "druid",
                "sorcerer"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "fur or a feather from a beast"
                ],
                "raw": "V, S, M (fur or a feather from a beast)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a creature and bestow upon it a magical enhancement. Choose one of the following effects; the target gains that effect until the spell ends.\n\nBear's Endurance: The target has advantage on Constitution Checks. It also gains 2d6 Temporary Hit Points, which are lost when the spell ends.\nBull's Strength: The target has advantage on Strength Checks, and his or her carrying Capacity doubles.\nCat's Grace: The target has advantage on Dexterity Checks. It also doesn't take damage from Falling 20 feet or less if it isn't Incapacitated.\nEagle's Splendor: The target has advantage on Charisma Checks.\nFox's Cunning: The target has advantage on Intelligence Checks.\nOwl's Wisdom: The target has advantage on Wisdom Checks.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.",
            "level": "2",
            "name": "Enhance Ability",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "sorcerer",
                "level2"
            ],
            "type": "2nd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of powdered iron"
                ],
                "raw": "V, S, M (a pinch of powdered iron)",
                "somatic": true,
                "verbal": true
            },
            "description": "You cause a creature or an object you can see within range to grow larger or smaller for the duration. Choose either a creature or an object that is neither worn nor carried. If the target is unwilling, it can make a Constitution saving throw. On a success, the spell has no effect. If the target is a creature, everything it is wearing and carrying changes size with it. Any item dropped by an affected creature returns to normal size at once.\n\nEnlarge. The target’s size doubles in all dimensions, and its weight is multiplied by eight. This growth increases its size by one category – from Medium to Large, for example. If there isn’t enough room for the target to double its size, the creature or object attains the maximum possible size in the space available. Until the spell ends, the target also has advantage on Strength checks and Strength saving throws. The target’s weapons also grow to match its new size. While these weapons are enlarged, the target’s attack with them deal 1d4 extra damage.\n\nReduce. The target’s size is halved in all dimensions, and its weight is reduced to one-eighth of normal. This reduction decreases its size by one category – from Medium to Small, for example. Until the spell ends, the target also has disadvantage on Strength checks and Strength saving throws. The target’s weapons also shrink to match its new size. While these weapons are reduced, the target’s attacks with them deal 1d4 less damage (this can’t reduce the damage below 1).",
            "duration": "Concentration, up to 1 minute",
            "level": "2",
            "name": "Enlarge/Reduce",
            "range": "30 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "wizard",
                "level2"
            ],
            "type": "2nd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "warlock"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You weave a distracting string of words, causing creatures of your choice that you can see within range and that can hear you to make a Wisdom saving throw. Any creature that can't be charmed succeeds on this saving throw automatically, and if you or your companions are fighting a creature, it has advantage on the save. On a failed save, the target has disadvantage on Wisdom (Perception) checks made to perceive any creature other than you until the spell ends or until the target can no longer hear you. The spell ends if you are incapacitated or can no longer speak.",
            "duration": "1 minute",
            "level": "2",
            "name": "Enthrall",
            "range": "60 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "warlock",
                "level2"
            ],
            "type": "2nd-level enchantment"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You convert raw materials into products of the same material. For example, you can fabricate a wooden bridge from a clump of trees, a rope from a patch of hemp, and clothes from flax or wool.\n\nChoose raw materials that you can see within range. You can fabricate a Large or smaller object (contained within a 10-foot cube, or eight connected 5-foot cubes), given a sufficient quantity of raw material. If you are working with metal, stone, or another mineral substance, however, the fabricated object can be no larger than Medium (contained within a single 5-foot cube). The quality of objects made by the spell is commensurate with the quality of the raw materials.\n\nCreatures or magic items can't be created or transmuted by this spell. You also can't use it to create items that ordinarily require a high degree of craftsmanship, such as jewelry, weapons, glass, or armor, unless you have proficiency with the type of artisan's tools used to craft such objects.",
            "duration": "Instantaneous",
            "level": "4",
            "name": "Fabricate",
            "range": "120 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "wizard",
                "level4"
            ],
            "type": "4th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "For the spell's duration, your eyes become an inky void imbued with dread power. One creature of your choice within 60 feet of you that you can see must succeed on a Wisdom saving throw or be affected by one of the following effects of your choice for the duration. On each of your turns until the spell ends, you can use your action to target another creature but can't target a creature again if it has succeeded on a saving throw against this casting of *eyebite*.\n\n* Asleep: The target falls Unconscious. It wakes up if it takes any damage or if another creature uses its action to shake the sleeper awake.\n* Panicked: The target is Frightened of you. On each of its turns, the Frightened creature must take the Dash action and move away from you by the safest and shortest available route, unless there is nowhere to move. If the target moves to a place at least 60 feet away from you where it can no longer see you, this Effect ends.\n* Sickened: The target has disadvantage on Attack Rolls and Ability Checks. At the end of each of its turns, it can make another Wisdom saving throw. If it succeeds, the Effect ends.",
            "duration": "Concentration, up to 1 minute",
            "level": "6",
            "name": "Eyebite",
            "range": "Self",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level6"
            ],
            "type": "6th-level necromancy"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You summon a spirit that assumes the form of an unusually intelligent, strong, and loyal steed, creating a long-lasting bond with it. Appearing in an unoccupied space within range, the steed takes on a form that you choose, such as a warhorse, a pony, a camel, an elk, or a mastiff. (Your DM mught allow other animals to be summoned as steeds.) The steed has the statistics of the chosen form, though it is a celestial, fey, or fiend (your choice) instead of its normal type. Additionally, if your steed has an Intelligence of 5 or less, its Intelligence becomes 6, and it gains the ability to understand one language of your choice that you speak.\n\nYour steed serves you as a mount, both in combat and out, and you have an instinctive bond with it that allows you to fight as a seamless unit. While mounted on your steed, you can make any spell you cast that targets only you also target your steed.\n\nWhen the steed drops to 0 hit points, it disappears, leaving behind no physical form. You can also dismiss your steed at any time as an action, causing it to disappear. In either case, casting this spell again summons the same steed, restored to its hit point maximum.\n\nWhile your steed is within 1 mile of you, you can communicate with it telepathically.\n\nYou can't have more than one steed bonded by this spell at a time. As an action, you can release the steed from its bond at any time, causing it to disappear.",
            "duration": "Instantaneous",
            "level": "2",
            "name": "Find Steed",
            "range": "30 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "paladin",
                "level2"
            ],
            "type": "2nd-level conjuration"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "bard",
                "cleric",
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a set of divinatory tools -- such as bones, ivory sticks, cards, teeth, or carved runes -- worth 100 gp and an object from the location you wish to find"
                ],
                "raw": "V, S, M (a set of divinatory tools -- such as bones, ivory sticks, cards, teeth, or carved runes -- worth 100 gp and an object from the location you wish to find)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell allows you to find the shortest, most direct physical route to a specific fixed location that you are familiar with on the same plane of existence. If you name a destination on another plan of existence, a destination that moves (such as a mobile fortress), or a destination that isn't specific (such as \"a green dragon's lair\"), the spell fails.\n\nFor the duration, as long as you are on the same plane of existence as the destination, you know how far it is and in what direction it lies. While you are traveling there, whenever you are presented with a choice of paths along the way, you atomatically determine which path is the shortest and most direct route (but not necessarily the safest route) to the destination.",
            "duration": "Concentration, up to 1 day",
            "level": "6",
            "name": "Find the Path",
            "range": "Self",
            "ritual": false,
            "school": "divination",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "level6"
            ],
            "type": "6th-level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid",
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You sense the presence of any trap within range that is within line of sight. A trap, for the purpose of this spell, includes anything that would inflict a sudden or unexpected effect you consider harmful or undesirable, which was specifically intended as such by its creator. Thus, the spell would sense an area affected by the *[alarm](../alarm/ \"alarm (lvl 1)\")* spell, a *[glyph of warding](../glyph-of-warding/ \"glyph of warding (lvl 3)\")*, or a mechanical pit trap, but it would not reveal a natural weakness in the floor, an unstable ceiling, or a hidden sinkhole.\n\nThis spell merely reveals that a trap is present. You don't learn the location of each trap, but you do learn the general nature of the danger posed by a trap you sense.",
            "duration": "Instantaneous",
            "level": "2",
            "name": "Find Traps",
            "range": "120 feet",
            "ritual": false,
            "school": "divination",
            "tags": [
                "cleric",
                "druid",
                "ranger",
                "level2"
            ],
            "type": "2nd-level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of phosphorous or a firefly"
                ],
                "raw": "V, S, M (a bit of phosphorous or a firefly)",
                "somatic": true,
                "verbal": true
            },
            "description": "Thin and wispy flames wreathe your body for the duration, shedding bright light in a 10-foot radius and dim light for an additional 10 feet, You can end the spell early by using an action to dismiss it.\n\nThe flames provide you with a warm shield or a chill shield, as you choose. The warm shield grants you resistance to cold damage, and the chill shield grants you resistance to fire damage.\n\nIn addition, whenever a creature within 5 feet of you hits you with a melee attack, the shield erupts with flame. The attacker takes 2d8 fire damage from a warm shield, or 2d8 cold damage from a cold shield.",
            "duration": "10 minutes",
            "level": "4",
            "name": "Fire Shield",
            "range": "Self",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "wizard",
                "level4"
            ],
            "type": "4th-level evocation"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "leaf of sumac"
                ],
                "raw": "V, S, M (leaf of sumac)",
                "somatic": true,
                "verbal": true
            },
            "description": "You evoke a fiery blade in your free hand. The blade is similar in size and shape to a scimitar, and it lasts for the duration. If you let go of the blade, it disappears, but you can evoke the blade again as a bonus action.\n\nYou can use your action to make a melee spell attack with the fiery blade. On a hit, the target takes 3d6 fire damage.\n\nThe flaming blade sheds bright light in a 10-foot radius and dim light for an additional 10 feet.",
            "duration": "Concentration, up to 10 minutes",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for every two slot levels above 2nd.",
            "level": "2",
            "name": "Flame Blade",
            "range": "Self",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "druid",
                "level2"
            ],
            "type": "2nd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "pinch of sulfur"
                ],
                "raw": "V, S, M (pinch of sulfur)",
                "somatic": true,
                "verbal": true
            },
            "description": "A vertical column of divine fire roars down from the heavens in a location you specify. Each creature in a 10-foot radius, 40-foot-high cylinder centered on a point within range must make a Dexterity saving throw. A creature takes 4d6 fire damage and 4d6 radiant damage on a failed save, or half as much damage on a successful one.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 6th level or higher, the fire damage or the radiant damage (your choice) inceases by 1d6 for each slot level above 5th.",
            "level": "5",
            "name": "Flame Strike",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "cleric",
                "level5"
            ],
            "type": "5th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of tallow, a pinch of brimstone, and a dusting of powdered iron"
                ],
                "raw": "V, S, M (a bit of tallow, a pinch of brimstone, and a dusting of powdered iron)",
                "somatic": true,
                "verbal": true
            },
            "description": "A 5-foot-diameter sphere of fire appears in an unoccupied space of your choice within range and lasts for the duration. Any creature that ends its turn within 5 feet of the sphere must make a Dexterity saving throw. The creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one.\n\nAs a bonus action, you can move the sphere up to 30 feet. If you ram the sphere into a creature, that creature must make the saving throw against the sphere's damage, and the sphere stops moving this turn.\n\nWhen you move the sphere, you can direct it over barriers up to 5 feet tall and jump it across pits up to 10 feet wide. The sphere ignites flammable objects not being worn or carried, and it sheds bright light in a 20-foot radius and dim light for an additional 20 feet.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 for each slot level above 2nd.",
            "level": "2",
            "name": "Flaming Sphere",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "wizard",
                "level2"
            ],
            "type": "2nd-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of lime, water, and earth"
                ],
                "raw": "V, S, M (a pinch of lime, water, and earth)",
                "somatic": true,
                "verbal": true
            },
            "description": "You attempt to turn one creature that you can see within range into stone. If the target's body is made of flesh, the creature must make a Constitution saving throw. On a failed save, it is restrained as its flesh begins to harden. On a successful save, the creature isn't affected.\n\nA creature restrained by this spell must make another Consititution saving throw at the end of each of its turns. If it successfully saves against this spell three times, the spell ends. If it fails saves three times, it is turned to stone and subjected to the petrified condition for the duration. The successes and failures don't need to be consecutive; keep track of both until the target collects three of a kind.\n\nIf the creature is physically broken while petrified, it suffers from similar deformities if it reverts to its original state.\n\nIf you maintain your concentration on this spell for the entire possible duration, the creature is turned to stone until the effect is removed.",
            "duration": "Concentration, up to 1 minute",
            "level": "6",
            "name": "Flesh to Stone",
            "range": "60 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "warlock",
                "wizard",
                "level6"
            ],
            "type": "6th-level transmutation"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a sprinkling of holy water, rare incense, and powdered ruby worth at least 1000 gp"
                ],
                "raw": "V, S, M (a sprinkling of holy water, rare incense, and powdered ruby worth at least 1000 gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a ward against magical travel that protects up to 40,000 square feet of floor space to a height of 30 feet above the floor. For the duration, creatures can't teleport into the area or use portals, such as those created by the *[gate](../gate/ \"gate (lvl 9)\")* spell, to enter the area. The spell proofs the area against planar travel, and therefore prevents creatures from accessing the area by way of the Astral Plane, Ethereal Plane, Feywild, Shadowfell, or the *[plane shift](../plane-shift/ \"plane shift (lvl 7)\")* spell.\n\nIn addition, the spell damages types of creatures that you choose when you cast it. Choose one or more of the following - Celestials, Elementals, fey, Fiends, and Undead. When a chosen creature enters the spell's area for the first time on a turn or starts its turn there, the creature takes 5d10 radiant or necrotic damage (your choice when you cast this spell).\n\nWhen you cast this spell, you can designate a password. A creature that speaks the password as it enters the area takes no damage from the spell.\n\nThe spell's area can't overlap with the area of another *forbiddance* spell. If you cast *forbiddance* every day for 30 days in the same location, the spell lasts until it is dispelled, and the material components are consumed on the last casting.",
            "duration": "1 day",
            "level": "6",
            "name": "Forbiddance",
            "range": "Touch",
            "ritual": true,
            "school": "abjuration",
            "tags": [
                "cleric",
                "level6"
            ],
            "type": "6th-level abjuration (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "druid",
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a leather strap, bound around the arm or a similar appendage"
                ],
                "raw": "V, S, M (a leather strap, bound around the arm or a similar appendage)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a willing creature. For the duration, the target's movement is unaffected by difficult terrain, and spells and other magical effects can neither reduce the target's speed nor cause the target to be paralyzed or restrained.\n\nThe target can also spend 5 feet of movement to automatically escape from nonmagical restraints, such as manacles or a creature that has it grappled. Finally, being underwater imposes no penalties on the target's movement or attacks.",
            "duration": "1 hour",
            "level": "4",
            "name": "Freedom of Movement",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "ranger",
                "level4"
            ],
            "type": "4th-level abjuration"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "cleric",
                "wizard",
                "paladin",
                "druid",
                "bard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You place a magical command on a creature that you can see within range, forcing it to carry out some service or refrain from some action or course of activity as you decide. If the creature can understand you, it must succeed on a Wisdom saving throw or become charmed by you for the duration. While the creature is charmed by you, it takes 5d10 psychic damage each time it acts in a manner directly counter to your instructions, but no more than once each day. A creature that can't understand you is unaffected by the spell.\n\nYou can issue any command you choose, short of an activity that would result in certain death. Should you issue a suicidal command, the spell ends.\n\nYou can end the spell early by using an action to dismiss it. A *[remove curse](../remove-curse/ \"remove curse (lvl 3)\")*, *[greater restoration](../greater-restoration/ \"greater restoration (lvl 5)\")*, or *[wish](../wish/ \"wish (lvl 9)\")* spell also ends it.",
            "duration": "30 days",
            "higher_levels": "When you cast this spell using a spell slot of 7th or 8th level, the duration is 1 year. When you cast this spell using a spell slot of 9th level, the spell lasts until it is ended by one of the spells mentioned above.",
            "level": "5",
            "name": "Geas",
            "range": "60 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "cleric",
                "wizard",
                "paladin",
                "druid",
                "bard",
                "level5"
            ],
            "type": "5th-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of salt and one copper piece placed on each of the corpse's eyes, which must remain there for the duration"
                ],
                "raw": "V, S, M (a pinch of salt and one copper piece placed on each of the corpse's eyes, which must remain there for the duration)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a corpse or other remains. For the duration, the target is protected from decay and can\u2019t become undead.\n\nThe spell also effectively extends the time limit on raising the target from the dead, since days spent under the influence of this spell don\u2019t count against the time limit of spells such as *[raise dead](../raise-dead/ \"raise dead (lvl 5)\")*.",
            "duration": "10 days",
            "level": "2",
            "name": "Gentle Repose",
            "range": "Touch",
            "ritual": true,
            "school": "necromancy",
            "tags": [
                "cleric",
                "wizard",
                "level2"
            ],
            "type": "2nd-level necromancy (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You transform up to ten centipedes, three spiders, five wasps, or one scorpion within range into versions of their natural forms for the duration. A centipede becomes a giant centipede, a spider becomes a giant spider, a wasp becomes a giant wasp, a wasp becomes a giant wasp, and a scorpion becomes a giant scorpion.\n\nEach creature obeys your verbal commands, and in combat they act on your turn each round. The DM has the statistics for these creatures and resolves their actions and moment.\n\nA creature remains in its giant size for the duration until it drops to 0 hit points, or until you use an action to dismiss the effect on it.\n\nThe DM might allow you to choose different targets. for example, if you transform a bee, its giant version might have the same stats as a giant wasp.",
            "duration": "Concentration, up to 10 minutes",
            "level": "4",
            "name": "Giant Insect",
            "range": "30 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "level4"
            ],
            "type": "4th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a glass or crystal bead that shatters when the spell ends"
                ],
                "raw": "V, S, M (a glass or crystal bead that shatters when the spell ends)",
                "somatic": true,
                "verbal": true
            },
            "description": "An immobile, faintly shimmering barrier springs into existence in a 10-foot radius around you and remains for the duration.\n\nAny spell of 5th level or lower cast from outside the barrier can\u2019t affect creatures or objects within it, even if the spell is cast using a higher level spell slot. Such a spell can target creatures and objects within the barrier, but the spell has no effect on them. Similarly, the area within the barrier is excluded from the areas affected by such spells.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 7th level or higher, the barrier blocks spells of one level higher for each slot level above 6th.",
            "level": "6",
            "name": "Globe of Invulnerability",
            "range": "Self",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "sorcerer",
                "wizard",
                "level6"
            ],
            "type": "6th-level abjuration"
        },
        {
            "casting_time": "1 hour",
            "classes": [
                "cleric",
                "wizard",
                "bard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "incense and powdered diamond worth at least 200 gp, which the spell consumes"
                ],
                "raw": "V, S, M, (incense and powdered diamond worth at least 200 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "When you cast this spell, you inscribe a glyph that harms other creatures, either upon a surface (such as a table or a section of floor or wall) or within an object that can be closed (such as a book, a scroll, or a treasure chest) to conceal the glyph. If you choose a surface, the glyph can cover an area of the surface no larger than 10 feet in diameter. If you choose an object, that object must remain in its place; if the object is moved more than 10 feet from where you cast this spell, the glyph is broken, and the spell ends without being triggered.\n\nThe glyph is nearly invisible and requires a successful Intelligence (Investigation) check against your spell save DC to be found.\n\nYou decide what triggers the glyph when you cast the spell. For glyphs inscribed on a surface, the most typical triggers include touching or standing on the glyph, removing another object covering the glyph, approaching within a certain distance of the glyph, or manipulating the object on which the glyph is inscribed. For glyphs inscribed within an object, the most common triggers include opening that object, approaching within a certain distance of the object, or seeing or reading the glyph. Once a glyph is triggered, this spell ends.\n\nYou can further refine the trigger so the spell activates only under certain circumstances or according to physical characteristics (such as height or weight), creature kind (for example, the ward could be set to affect aberrations or drow), or alignment. You can also set conditions for creatures that don’t trigger the glyph, such as those who say a certain password.\n\nWhen you inscribe the glyph, choose *explosive runes* or a *spell glyph*.\n\n* Explosive Runes: When triggered, the glyph erupts with magical energy in a 20-foot-radius Sphere centered on the glyph. The Sphere spreads around corners. Each creature in the aura must make a Dexterity saving throw. A creature takes 5d8 acid, cold, fire, lightning, or thunder damage on a failed saving throw (your choice when you create the glyph), or half as much damage on a successful one.\n* Spell Glyph: You can store a prepared spell of 3rd Level or lower in the glyph by casting it as part of creating the glyph. The spell must target a single creature or an area. The spell being stored has no immediate Effect when cast in this way. When the glyph is triggered, the stored spell is cast. If the spell has a target, it Targets the creature that triggered the glyph. If the spell affects an area, the area is centered on that creature. If the spell summons Hostile creatures or creates harmful Objects or traps, they appear as close as possible to the intruder and Attack it. If the spell requires Concentration, it lasts until the end of its full Duration.",
            "duration": "Until dispelled or triggered",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, the damage of an *explosive runes* glyph increases by 1d8 for each slot level above 3rd. If you create a *spell glyph*, you can store any spell of up to the same level as the slot you use for the *glyph of warding*.",
            "level": "3",
            "name": "Glyph of Warding",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "wizard",
                "bard",
                "level3"
            ],
            "type": "3rd-level abjuration"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "ranger",
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You conjure a vine that sprouts from the ground in an unoccupied space of your choice that you can see within range. When you cast this spell, you can direct the vine to lash out at a creature within 30 feet of it that you can see. That creature must succeed on a Dexterity saving throw or be pulled 20 feet directly toward the vine.\n\nUntil the spell ends, you can direct the vine to lash out at the same creature or another one as a bonus action on each of your turns.",
            "duration": "Concentration, up to 1 minute",
            "level": "4",
            "name": "Grasping Vine",
            "range": "30 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "ranger",
                "druid",
                "level4"
            ],
            "type": "4th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard",
                "bard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You or a creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target\u2019s person.",
            "duration": "Concentration, up to 1 minute",
            "level": "4",
            "name": "Greater Invisibility",
            "range": "Touch",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "sorcerer",
                "wizard",
                "bard",
                "level4"
            ],
            "type": "4th-level illusion"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid",
                "bard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "diamond dust worth at least 100 gp, which the spell consumes"
                ],
                "raw": "V, S, M (diamond dust worth at least 100 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "You imbue a creature you touch with positive energy to undo a debilitating effect.  You can reduce the taret's exhaustion level by one, or end one of the following effects on the target:\n\n* One effect that charmed or petrified the target\n\n* One curse, including the target’s attunement to a cursed magic item\n\n* Any reduction to one of the target’s ability scores\n\n* One effect reducing the target’s hit point maximum",
            "duration": "Instantaneous",
            "level": "5",
            "name": "Greater Restoration",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "druid",
                "bard",
                "level5"
            ],
            "type": "5th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "A Large spectral guardian appears and hovers for the duration in an unoccupied space of your choice that you can see within range. The guardian occupies that space and is indistinct except for a gleaming sword and shield emblazoned with the symbol of your deity.\n\nAny creature hostile to you that moves to a space within 10 feet of the guardian for the first time on a turn must succeed on a Dexterity saving throw. The creature takes 20 radiant damage on a failed save, or half as much damage on a successful one. The guardian vanishes when it has dealt a total of 60 damage.",
            "duration": "8 hours",
            "level": "4",
            "name": "Guardian of Faith",
            "range": "30 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "cleric",
                "level4"
            ],
            "type": "4th-level conjuration"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "wizard",
                "bard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "burning incense, a small measure of brimstone and oil, a knotled string, a small amount of umber hulk blood, and a small silver rod worth at least 10 gp"
                ],
                "raw": "V, S, M (burning incense, a small measure of brimstone and oil, a knotled string, a small amount of umber hulk blood, and a small silver rod worth at least 10 gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a ward that protects up to 2,500 square feet of floor space (an area 50 feet square, or one hundred 5-foot squares or twenty-five 10-foot squares). The warded area can be up to 20 feet tall, and shaped as you desire. You can ward several stories of a stronghold by dividing the area among them, as long as you can walk into each contiguous area while you are casting the spell.\n\nWhen you cast this spell, you can specify individuals that are unaffected by any or all of the effects that you choose. You can also specify a password that, when spoken aloud, makes the speaker immune to these effects.\n\n*Guards and wards* creates the following effects within the warded area.\n\nCorridors: Fog fills all the warded corridors, making them heavily obscured. In addition, at each intersection or branching Passage offering a choice of direction, there is a 50 percent chance that a creature other than you will believe it is going in the opposite direction from the one it chooses.\n\nDoors: All doors in the warded area are magically locked, as if sealed by an Arcane Lock spell. In addition, you can cover up to ten doors with an Illusion (equivalent to the illusory object function of the Minor Illusion spell) to make them appear as plain sections of wall.\n\nStairs: Webs fill all Stairs in the warded area from top to bottom, as the web spell. These strands regrow in 10 minutes if they are burned or torn away while guards and wards lasts.\n\nOther Spell Effect: You can place your choice of one of the following magical Effects within the warded area of the stronghold.\n* Place *[dancing lights](../dancing-lights/ \"dancing lights (cantrip)\")* in four corridors. You can designate a simple program that the lights repeat as long as guards and wards lasts.\n* Place *[magic mouth](../magic-mouth/ \"magic mouth (lvl 2)\")* in two locations.\n* Place *[stinking cloud](../stinking-cloud/ \"stinking cloud (lvl 3)\")* in two locations. The vapors appear in the places you designate; They return within 10 minutes if dispersed by wind while *guards and wards* lasts.\n* Place a constant *[gust of wind](../gust-of-wind/ \"gust of wind (lvl 2)\")* in one corridor or room.\n* Place a *[suggestion](../suggestion/ \"suggestion (lvl 2)\")* in one location. You select an area of up to 5 feet square, and any creature that enters or passes through the area recieves the suggestion mentally.\n\nThe whole warded area radiates magic. A *[dispel magic](../dispel-magic/ \"dispel magic (lvl 3)\")* cast on a specific effect, if successful, removes only that effect.\n\nYou can create a permanently guarded and warded structure by casting this spell there every day for one year.",
            "duration": "24 hours",
            "level": "6",
            "name": "Guards and Wards",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "wizard",
                "bard",
                "level6"
            ],
            "type": "6th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard",
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a legume seed"
                ],
                "raw": "V, S, M (a legume seed)",
                "somatic": true,
                "verbal": true
            },
            "description": "A line of strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose for the spell's duration. Each creature that starts its turn in the line must succeed on a Strength saving throw or be pushed 15 feet away from you in a direction following the line.\n\nAny creature in the line must spend 2 feet of movement for every 1 foot it moves when moving closer to you.\n\nThe gust disperses gas or vapor, and it extinguishes candles, torches, and similar unprotected flames in the area. It causes protected fiames, such as those of lanterns, to dance wildly and has a 50 percent chance to extinguish them.\n\nAs a bonus action on each of your turns before the spell ends, you can change the direction in which the line blasts from you.",
            "duration": "Concentration, up to 1 minute",
            "level": "2",
            "name": "Gust of Wind",
            "range": "Self (60-foot line)",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "druid",
                "level2"
            ],
            "type": "2nd-level evocation"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "bard",
                "druid",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a stone, a twig, and a bit of green plant"
                ],
                "raw": "V, S, M (a stone, a twig, and a bit of green plant)",
                "somatic": true,
                "verbal": true
            },
            "description": "You make natural terrain in a 150-foot cube in range look, sound, and smell like some other sort of natural terrain. Thus, open fields or a road can be made to resemble a swamp, hill, crevasse, or some other difficult or impassable terrain. A pond can be made to seem like a grassy meadow, a precipice like a gentle slope, or a rock-strewn gully like a wide and smooth road. Manufactured structures, equipment, and creatures within the area aren\u2019t changed in appearance.\n\nThe tactile characteristics of the terrain are unchanged, so creatures entering the area are likely to see through the illusion. If the difference isn\u2019t obvious by touch, a creature carefully examining the illusion can attempt an Intelligence (Investigation) check against your spell save DC to disbelieve it. A creature who discerns the illusion for what it is, sees it as a vague image superimposed on the terrain.",
            "duration": "24 hours",
            "level": "4",
            "name": "Hallucinatory Terrain",
            "range": "300 feet",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "druid",
                "warlock",
                "wizard",
                "level4"
            ],
            "type": "4th-level illusion"
        },
        {
            "casting_time": "24 hours",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "herbs, oils, and incense worth at least 1,000 gp, which the spell consumes"
                ],
                "raw": "V, S, M (herbs, oils, and incense worth at least 1,000 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a point and infuse an area around it with holy (or unholy) power. The area can have a radius up to 60 feet, and the spell fails if the radius includes an area already under the effect a *hallow* spell. The affected area is subject to the following effects.\n\nFirst, celestials, elementals, fey, fiends, and undead can’t enter the area, nor can such creatures charm, frighten, or possess creatures within it. Any creature charmed, frightened, or possessed by such a creature is no longer charmed, frightened, or possessed upon entering the area. You can exclude one or more of those types of creatures from this effect.\n\nSecond, you can bind an extra effect to the area. Choose the effect from the following list, or choose an effect offered by the DM. Some of these effects apply to creatures in the area; you can designate whether the effect applies to all creatures, creatures that follow a specific deity or leader, or creatures of a specific sort, such as orcs or trolls. When a creature that would be affected enters the spell’s area for the first time on a turn or starts its turn there, it can make a Charisma saving throw. On a success, the creature ignores the extra effect until it leaves the area.\n\nCourage: Affected creatures can't be Frightened while in the area.\n\nDarkness: Darkness fills the area. Normal light, as well as magical light created by Spells of a lower level than the slot you used to cast this spell, can't illuminate the area.\n\nDaylight: Bright light fills the area. Magical Darkness created by Spells of a lower level than the slot you used to cast this spell can't extinguish the light.\n\nEnergy Protection: Affected creatures in the area have Resistance to one damage type of your choice, except for bludgeoning, piercing, or slashing.\n\nEnergy Vulnerability: Affected creatures in the area have vulnerability to one damage type of your choice, except for bludgeoning, piercing, or slashing.\n\nEverlasting Rest: Dead bodies interred in the area can't be turned into Undead.\n\nExtradimensional Interference: Affected creatures can't move or Travel using teleportation or by extradimensional or interplanar means.\n\nFear: Affected creatures are Frightened while in the area.\n\nSilence: No sound can emanate from within the area, and no sound can reach into it.\n\nTongues: Affected creatures can communicate with any other creature in the area, even if they don't share a Common language.",
            "duration": "Until dispelled",
            "level": "5",
            "name": "Hallow",
            "range": "Touch",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "cleric",
                "level5"
            ],
            "type": "5th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You unleash a virulent disease on a creature that you can see within range. The target must make a Constitution saving throw. On a failed save, it takes 14d6 necrotic damage, or half as much damage on a successful save. The damage can\u2019t reduce the target\u2019s hit points below 1. If the target fails the saving throw, its hit point maximum is reduced for 1 hour by an amount equal to the necrotic damage it took. Any effect that removes a disease allows a creature\u2019s hit point maximum to return to normal before that time passes.",
            "duration": "Instantaneous",
            "level": "6",
            "name": "Harm",
            "range": "60 feet",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "cleric",
                "level6"
            ],
            "type": "6th-level necromancy"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "bard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a piece of iron and a flame"
                ],
                "raw": "V, S, M (a piece of iron and a flame)",
                "somatic": true,
                "verbal": true
            },
            "description": "Choose a manufactured metal object, such as a metal weapon or a suit of heavy or medium metal armor, that you can see within range. You cause the object to glow red-hot. Any creature in physical contact with the object takes 2d8 fire damage when you cast the spell. Until the spell ends, you can use a bonus action on each of your subsequent turns to cause this damage again.\n\nIf a creature is holding or wearing the object and takes the damage from it, the creature must succeed on a Constitution saving throw or drop the object if it can. If it doesn\u2019t drop the object, it has disadvantage on attack rolls and ability checks until the start of your next turn.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.",
            "level": "2",
            "name": "Heat Metal",
            "range": "60 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "bard",
                "level2"
            ],
            "type": "2nd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Choose a creature that you can see within range. A surge of positive energy washes through the creature, causing it to regain 70 hit points. This spell also ends blindness, deafness, and any diseases affecting the target. This spell has no effect on constructs or undead.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 7th level or higher, the amount of healing increases by 10 for each slot level above 6th.",
            "level": "6",
            "name": "Heal",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "cleric",
                "druid",
                "level6"
            ],
            "type": "6th-level evocation"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "cleric",
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a gem-encrusted bowl worth at least 1,000 gp, which the spell consumes"
                ],
                "raw": "V, S, M (a gem-encrusted bowl worth at least 1,000 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "You bring forth a great feast, including magnificent food and drink. The feast takes 1 hour to consume and disappears at the end of that time, and the beneficial effects don\u2019t set in until this hour is over. Up to twelve other creatures can partake of the feast.\n\nA creature that partakes of the feast gains several benefits. The creature is cured of all diseases and poison, becomes immune to poison and being frightened, and makes all Wisdom saving throws with advantage. Its hit point maximum also increases by 2d10, and it gains the same number of hit points. These benefits last for 24 hours",
            "duration": "Instantaneous",
            "level": "6",
            "name": "Heroes' Feast",
            "range": "30 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "cleric",
                "druid",
                "level6"
            ],
            "type": "6th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a small, straight piece of iron"
                ],
                "raw": "V, S, M (a small, straight piece of iron)",
                "somatic": true,
                "verbal": true
            },
            "description": "Choose a creature that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. This spell has no effect on undead. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 6th level or higher, you can target one additional creature for each slot level above 5th. The creatures must be within 30 feet of each other when you target them.",
            "level": "5",
            "name": "Hold Monster",
            "range": "90 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level5"
            ],
            "type": "5th-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of dust and a few drops of water"
                ],
                "raw": "V, S, M (a pinch of dust and a few drops of water)",
                "somatic": true,
                "verbal": true
            },
            "description": "A hail of rock-hard ice pounds to the ground in a 20-foot-radius, 40-foot-high cylinder centered on a point within range. Each creature in the cylinder must make a Dexterity saving throw. A creature takes 2d8 bludgeoning damage and 4d6 cold damage on a failed save, or half as much damage on a successful one.\n\nHailstones turn the storm\u2019s area of effect into difficult terrain until the end of your next turn.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d8 for each slot level above 4th.",
            "level": "4",
            "name": "Ice Storm",
            "range": "300 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "level4"
            ],
            "type": "4th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid",
                "sorcerer"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a few grains of sugar, some kernels of grain, and a smear of fat"
                ],
                "raw": "V, S, M (a few grains of sugar, some kernels of grain, and a smear of fat)",
                "somatic": true,
                "verbal": true
            },
            "description": "Swarming, biting locusts fill a 20-foot-radius sphere centered on a point you choose within range, The sphere spreads around corners. The sphere remains for the duration, and its area is lightly obscured. The sphere's area is difficult terrain.\n\nWhen the area appears, each creature in it must make a Constitution saving throw. A creature takes 4d10 piercing damage on a failed save, or half as much damage on a successful one. A creature must also make this saving throw when it enters the spell's area for the first time on a turn or ends its turn there.",
            "duration": "Concentration, up to 10 minutes",
            "higher_levels": "When you cast this spell using a spell slot of 6th levei or higher, the damage increases by 1d10 for each slot level above 5th.",
            "level": "5",
            "name": "Insect Plague",
            "range": "300 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "cleric",
                "druid",
                "sorcerer",
                "level5"
            ],
            "type": "5th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard",
                "bard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "Choose an object that you can see within range. The object can be a door, a box, a chest, a set of manacles, a padlock, or another object that contains a mundane or magical means that prevents access.\n\nA target that is held shut by a mundane lock ar that is stuck or barred becomes unlocked, unstuck, or unbarred. If the object has multiple locks, only one of them is unlocked.\n\nIf you choose a target that is held shut with *[arcane lock](../arcane-lock/ \"arcane lock (lvl 2)\")*, that spell is suppressed for 10 minutes, during which time the target can be opened and shut normally.\n\nWhen you cast the spell, a loud knock, audible from as far away as 300 feet, emanates from the target object.",
            "duration": "Instantaneous",
            "level": "2",
            "name": "Knock",
            "range": "60 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "wizard",
                "bard",
                "level2"
            ],
            "type": "2nd-level transmutation"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "cleric",
                "wizard",
                "bard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "incense worth at least 250 gp, which the spell consumes, and four ivory strips worth at least 50 gp each"
                ],
                "raw": "V, S, M (incense worth at least 250 gp, which the spell consumes, and four ivory strips worth at least 50 gp each)",
                "somatic": true,
                "verbal": true
            },
            "description": "Name or describe a person, place, or object. The spell brings to your mind a brief summary of the significant lore about the thing you named. The lore might consist of current tales, forgotten stories, or even secret lore that has never been widely known. If the thing you named isn't of legendary importance, you gain no information. The more information you already have about the thing, the more precise and detailed the information you receive is.\n\nThe more information you already have about the thing, the more precise and detailed the information you receive is. The information you learn is accurate but might be couched in figurative language. For example, if you have a mysterious magic axe on hand, the spell might yield this information - Woe to the evildoer whose hand touches the axe, for even the haft slices the hand of the evil ones. Only a true Child of Stone, lover and beloved of Moradin, may Awaken the true powers of the axe, and only with the sacred word Rudnogg on the lips.",
            "duration": "Instantaneous",
            "level": "5",
            "name": "Legend Lore",
            "range": "Self",
            "ritual": false,
            "school": "divination",
            "tags": [
                "cleric",
                "wizard",
                "bard",
                "level5"
            ],
            "type": "5th-level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "either a small leather loop or a pieee of golden wire bent into a cup shape with a long shank on one end"
                ],
                "raw": "V, S, M (either a small leather loop or a pieee of golden wire bent into a cup shape with a long shank on one end)",
                "somatic": true,
                "verbal": true
            },
            "description": "One creature or object of your choice that you can see within range rises vertically, up to 20 feet, and remains suspended there for the duration. The spell can levitate a target that weighs up to 500 pounds. An unwilling creature that succeeds on a Constitution saving throw is unaffected.\n\nThe target can move only by pushing or pulling against a fixed object or surface within reach (such as a wall or a ceiling), which allows it to move as if it were climbing. You can change the target's altitude by up to 20 feet in either direction on your turn. If you are the target, you can move up or down as part of your move. Otherwise, you can use your action to move the target, which must remain within the spell's range.\n\nWhen the spell ends, the target floats gently to the ground if it is still aloft.",
            "duration": "Concentration, up to 10 minutes",
            "level": "2",
            "name": "Levitate",
            "range": "60 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "wizard",
                "level2"
            ],
            "type": "2nd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of fur from a bloodhound"
                ],
                "raw": "V, S, M (a bit of fur from a bloodhound)",
                "somatic": true,
                "verbal": true
            },
            "description": "Describe or name a specific kind of beast or plant. Concentrating on the voice of nature in your surroundings, you learn the direction and distance to the closest creature or plant of that kind within 5 miles, if any are present.",
            "duration": "Instantaneous",
            "level": "2",
            "name": "Locate Animals or Plants",
            "range": "Self",
            "ritual": true,
            "school": "divination",
            "tags": [
                "bard",
                "druid",
                "ranger",
                "level2"
            ],
            "type": "2nd-level divination (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of fur and a rod of amber, crystal, or glass"
                ],
                "raw": "V, S, M (a bit of fur and a rod of amber, crystal, or glass)",
                "somatic": true,
                "verbal": true
            },
            "description": "A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much damage on a successful one.\n\nThe lightning ignites flammable objects in the area that aren't being worn or carried.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.",
            "level": "3",
            "name": "Lightning Bolt",
            "range": "Self (100-foot line)",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "level3"
            ],
            "type": "3rd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "druid",
                "paladin",
                "ranger",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of fur from a bloodhound"
                ],
                "raw": "V, S, M (a bit of fur from a bloodhound)",
                "somatic": true,
                "verbal": true
            },
            "description": "Describe or name a creature that is familiar to you. You sense the direction to the creature's location, as long as that creature is within 1,000 feet of you. If the creature is moving, you know the direction of its movement.\n\nThe spell can locate a specific creature known to you, or the nearest creature of a specific kind (such as a human or a unicorn), so long as you have seen such a creature up close\u2014-within 30 feet-\u2014at least once. If the creature you described or named is in a different form, such as being under the effects of a *[polymorph](../polymorph/ \"polymorph (lvl 4)\")* spell, this spell doesn\u2019t locate the creature.\n\nThis spell can't locate a creature if running water at least 10 feet wide blocks a direct path between you and the creature.",
            "duration": "Concentration, up to 1 hour",
            "level": "4",
            "name": "Locate Creature",
            "range": "Self",
            "ritual": false,
            "school": "divination",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "paladin",
                "ranger",
                "wizard",
                "level4"
            ],
            "type": "4th-level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "druid",
                "paladin",
                "ranger",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a forked twig"
                ],
                "raw": "V, S, M (a forked twig)",
                "somatic": true,
                "verbal": true
            },
            "description": "Describe or name an object that is familiar to you. You sense the direction to the object's location, as long as that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement.\n\nThe spell can locate a specific object known to you, as long as you have seen it up close-\u2014within 30 feet-\u2014at least once. Alternatively, the spell can locate the nearest object of a particular kind, such as a certain kind of apparel, jewelry, furniture, tool, or weapon.\n\nThis spell can't locate an object if any thickness of lead, even a thin sheet, blocks a direct path between you and the object.",
            "duration": "Concentration, up to 10 minutes",
            "level": "2",
            "name": "Locate Object",
            "range": "Self",
            "ritual": false,
            "school": "divination",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "paladin",
                "ranger",
                "wizard",
                "level2"
            ],
            "type": "2nd-level divination"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a gem, crystal, reliquary, or some other ornamental container worth at least 500 gp"
                ],
                "raw": "V, S, M (a gem, crystal, reliquary, or some other ornamental container worth at least 500 gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "Your body falls into a catatonic state as your soul leaves it and enters the container you used for the spell's material component. While your soul inhabits the container, you are aware of your surroundings as if you were in the container's space. You can't move or use reactions. The only action you can take is to project your soul up to 100 feet out of the container, either returning to your living body (and ending the spell) or attempting to possess a humanoid's body.\n\nYou can attempt to possess any humanoid within 100 feet of you that you can see (creatures warded by a *[protection from evil and good](../protection-from-evil-and-good \"protection from evil and good (lvl 1)\")* or *[magic circle](../magic-circle \"magic circle (lvl 3)\")* spell can't be possessed). The target must make a Charisma saving throw. On a failure, your soul moves into the target's body, and the target's soul becomes trapped in the container. On a success, the target resists your efforts to possess it, and you can't attempt to possess it again for 24 hours.\n\nOnce you possess a creature's body, you control it. Your game statistics are replaced by the statistics of the creature, though you retain your alignment and your Intelligence, Wisdom, and Charisma scores. You retain the benefit of your own class features. If the target has any class levels, you can't use any of its class features.\n\nMeanwhile, the possessed creature's soul can perceive from the container using its own senses, but it can't move or take actions at all.\n\nWhile possessing a body, you can use your action to return from the host body to the container if it is within 100 feet of you, returning the host creature's soul to its body. If the host body dies while you're in it, the creature dies, and you must make a Charisma saving throw against your own spellcasting DC. On a success, you return to the container if it is within 100 feet of you. Otherwise, you die.\n\nIf the container is destroyed or the spell ends, your soul immediately returns to your body. If your body is more than 100 feet away from you or if your body is dead when you attempt to return to it, you die. If another creature's soul is in the container when it is destroyed, the creature's soul returns to its body if the body is alive and within 100 feet. Otherwise, that creature dies.\n\nWhen the spell ends, the container is destroyed.",
            "duration": "Until dispelled",
            "level": "6",
            "name": "Magic Jar",
            "range": "Self",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "wizard",
                "level6"
            ],
            "type": "6th-level necromancy"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "paladin",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a nonmagical weapon. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, the bonus increases to +2. When you use a spell slot of 6th level or higher, the bonus increases to +3.",
            "level": "2",
            "name": "Magic Weapon",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "paladin",
                "wizard",
                "level2"
            ],
            "type": "2nd-level transmutation"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "bard",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a small bit of honeycomb and jade dust worth at least 10 gp, which the spell consumes"
                ],
                "raw": "V, S, M (a small bit of honeycomb and jade dust worth at least 10 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "You implant a message within an object in range, a message that is uttered when a trigger condition is met. Choose an object that you can see that isn't being worn or carried by another creature, then speak the message, which must be 25 words or less, though it can be delivered over as long as ten minutes. Finally, determine the circumstance that will trigger the spell to deliver your message.\n\nWhen that circumstance occurs, a magical mouth appears on the object and recites the message in your voice at the same volume you spoke. If the object you chose has a mouth or something that looks like a mouth (for example, the mouth of a statue) the magical mouth appears there so that the words appear to come from the object's mouth. When you cast this spell, you can have the spell end after it delivers its message or it can remain and repeat its message whenever the trigger occurs.\n\nThe triggering circumstance can be as general or as detailed as you like, though it must be based on visual or audible conditions that occur within 30 feet of the object. For example, you could instruct the mouth to speak when any creature moves within 30 feet of the object or when a silver bell rings within 30 feet.",
            "duration": "Until dispelled",
            "level": "2",
            "name": "Magic Mouth",
            "range": "30 feet",
            "ritual": true,
            "school": "illusion",
            "tags": [
                "bard",
                "wizard",
                "level2"
            ],
            "type": "2nd-level illusion (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A wave of healing energy washes out from a point of your choice within range. Choose up to six creatures in a 30-foot-radius sphere centered on that point. Each target regains hit points equal to 3d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 6th level or higher, the healing increases by 1d8 for each slot level above 5th.",
            "level": "5",
            "name": "Mass Cure Wounds",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "level5"
            ],
            "type": "5th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a snake's tongue and either a bit of honeycomb or a drop of sweet oil"
                ],
                "raw": "V, M (a snake's tongue and either a bit of honeycomb or a drop of sweet oil)",
                "somatic": false,
                "verbal": true
            },
            "description": "You suggest a course of activity (limited to a sentence or two) and magically influence up to twelve creatures of your choice that you can see within range and that can hear and understand you. Creatures that can't be charmed are immune to this effect. The suggestion must be worded in such a manner as to make the course of action sound reasonable. Asking the creature to stab itself, throw itself onto a spear, immolate itself, or do some other obviously harmful act automatically negates the effect of the spell.\n\nEach target must make a Wisdom saving throw. On a failed save, it pursues the course of action you described to the best of its ability. The suggested course of action can continue for the entire duration. If the suggested activity can be completed in a shorter time, the spell ends when the subject finishes what it was asked to do.\n\nYou can also specify conditions that will trigger a special activity during the duration. For example, you might suggest that a group of soldiers give all their money to the first beggar they meet. If the condition isn't met before the spell ends, the activity isn\u2019t performed.\n\nIf you or any of your companions damage a creature affected by this spell, the spell ends for that creature.",
            "duration": "24 hours",
            "higher_levels": "When you cast this spell using a 7th-level spell slot, the duration is 10 days. When you use an 8th-level spell slot, the duration is 30 days. When you use a 9th-level spell slot, the duration is a year and a day.",
            "level": "6",
            "name": "Mass Suggestion",
            "range": "60 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level6"
            ],
            "type": "6th-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it's impossible to track which image is real. You can use your action to dismiss the illusory duplicates.\n\nEach time a creature targets you with an attack during the spell's duration, roll a d20 to determine whether the attack instead targets one of your duplicates.\n\nlf you have three duplicates, you must roll a 6 or higher to change the attack's target to a duplicate. With two duplicates, you must roll an 8 or higher. With one duplicate, you must roll an 11 or higher.\n\nA duplicate's AC equals 10 + your Dexterity modifier. If an attack hits a duplicate, the duplicate is destroyed. A duplicate can be destroyed only by an attack that hits it. It ignores all other damage and effects. The spell ends when all three duplicates are destroyed.\n\nA creature is unaffected by this spell if it can't see, if it relies on senses other than sight, such as blindsight, or if it can perceive illusions as false, as with truesight.",
            "duration": "1 minute",
            "level": "2",
            "name": "Mirror Image",
            "range": "Self",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "sorcerer",
                "warlock",
                "wizard",
                "level2"
            ],
            "type": "2nd-level illusion"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "S",
                "somatic": true,
                "verbal": false
            },
            "description": "You become invisible at the same time that an illusory double of you appears where you are standing. The double lasts for the duration, but the invisibility ends if you attack or cast a spell.\n\nYou can use your action to move your illusory double up to twice your speed and make it gesture, speak, and behave in whatever way you choose.\n\nYou can see through its eyes and hear through its ears as if you were located where it is. On each of your turns as a bonus action, you can switch from using its senses to using your own, or back again. While you are using its senses, you are blinded and deafened in regard to your own surrounding.",
            "duration": "Concentration, up to 1 hour",
            "level": "5",
            "name": "Mislead",
            "range": "Self",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "wizard",
                "level5"
            ],
            "type": "5th-level illusion"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.",
            "duration": "Instantaneous",
            "level": "2",
            "name": "Misty Step",
            "range": "Self",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "sorcerer",
                "warlock",
                "wizard",
                "level2"
            ],
            "type": "2nd-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You attempt to reshape another creature's memories. One creature that you can see must make a Wisdom saving throw. If you are fighting the creature, it has advantage on the saving throw. On a failed save, the target becomes charmed by you for the duration. The charmed target is incapacitated and unaware of its surroundings, though it can still hear you. If it takes any damage or is targeted by another spell, this spell ends, and none of the target's memories are modified.\n\nWhile this charm lasts, you can affect the target's memory of an event that it experienced within the last 24 hours and that lasted no more than 10 minutes. You can permanently eliminate all memory of the event, allow the target to recall the event with perfect clarity and exacting detail, change its memory of the details of the event, or create a memory of some other event.\n\nYou must speak to the target to describe how its memories are affected, and it must be able to understand your language for the modified memories to take root. Its mind fills in any gaps in the details of your description. If the spell ends before you have finished describing the modified memories, the creature's memory isn\u2019t altered. Otherwise, the modified memories take hold when the spell ends.\n\nA modified memory doesn\u2019t necessarily affect how a creature behaves, particularly if the memory contradicts the creature's natural inclinations, alignment, or beliefs. An illogical modified memory, such as implanting a memory of how much the creature enjoyed dousing itself in acid, is dismissed, perhaps as a bad dream. The DM might deem a modified memory too nonsensical to affect a creature in a significant manner.\n\nA *[remove curse](../remove-curse/ \"remove curse (lvl 3)\")* or *[greater restoration](../greater-restoration/ \"greater restoration (lvl 5)\")* spell cast on the target restores the creature's true memory.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "If you cast this spell using a spell slot of 6th level or higher, you can alter the target\u2019s memories of an event that took place up to 7 days ago (6th level), 30 days ago (7th level), 1 year ago (8th level), or any time in the creature\u2019s past (9th level).",
            "level": "5",
            "name": "Modify Memory",
            "range": "30 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "wizard",
                "level5"
            ],
            "type": "5th-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "several seeds of any moonseed plant and a pieee of opalescent feldspar"
                ],
                "raw": "V, S, M (several seeds of any moonseed plant and a pieee of opalescent feldspar)",
                "somatic": true,
                "verbal": true
            },
            "description": "A silvery beam of pale light shines down in a 5-foot-radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, dim light fills the cylinder.\n\nWhen a creature enters the spell's area for the first time on a turn or starts its turn there, it is engulfed in ghostly flames that cause searing pain, and it must make a Constitution saving throw. It takes 2d10 radiant damage on a failed save, or half as much on a successful one.\n\nA shapechanger makes its saving throw with disadvantage. If it fails, it also instantly reverts to its original form and can't assume a different form until it leaves the spells light.\n\nOn each of your turns after you cast this spell use can use an action to move the beam 60 feet in any direction.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d10 for each slot level above 2nd.",
            "level": "2",
            "name": "Moonbeam",
            "range": "120 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "druid",
                "level2"
            ],
            "type": "2nd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "an iron blade and a small bag containing a mixture of soils--c1ay, loam, and sand"
                ],
                "raw": "V, S, M (an iron blade and a small bag containing a mixture of soils--c1ay, loam, and sand)",
                "somatic": true,
                "verbal": true
            },
            "description": "Choose an area of terrain no larger than 40 feet on a side within range. You can reshape dirt, sand, or clay in the area in any manner you choose for the duration. You can raise or lower the area's elevation, create or fill in a trench, erect or flatten a wall, or form a pillar. The extent of any such changes can't exceed half the area's largest dimension. So, if you affect a 40-foot square, you can create a pillar up to 20 feet high, raise or lower the square's elevation by up to 20 feet, dig a trench up to 20 feet deep, and so on. It takes 10 minutes for these changes to complete.\n\nAt the end of every 10 minutes you spend concentrating on the spell, you can choose a new area of terrain to affect.\n\nBecause the terrain\u2019s transformation occurs slowly, creatures in the area can't usually be trapped or injured by the ground's movement. This spell can't manipulate natural stone or stone construction. Rocks and structures shift to accommodate the new terrain. If the way you shape the terrain would make a structure unstable, it might collapse.\n\nSimilarly, this spell doesn't directly affect plant growth. The moved earth carries any plants along with it.",
            "duration": "Concentration, up to 2 hours",
            "level": "6",
            "name": "Move Earth",
            "range": "120 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "level6"
            ],
            "type": "6th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "ashes from a burned leaf of mistletoe and a sprig of spruce"
                ],
                "raw": "V, S, M (ashes from a burned leaf of mistletoe and a sprig of spruce)",
                "somatic": true,
                "verbal": true
            },
            "description": "A veil of shadows and silence radiates from you, masking you and your companions from detection. For the duration, each creature you choose within 30 feet of you (including you) has a +10 bonus to Dexterity (Stealth) checks and can\u2019t be tracked except by magical means. A creature that receives this bonus leaves behind no tracks or other traces of its passage.",
            "duration": "Concentration, up to 1 hour",
            "level": "2",
            "name": "Pass without Trace",
            "range": "Self",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "druid",
                "ranger",
                "level2"
            ],
            "type": "2nd-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of sesame seeds"
                ],
                "raw": "V, S, M (a pinch of sesame seeds)",
                "somatic": true,
                "verbal": true
            },
            "description": "A Passage appears at a point of your choice that you can see on a wooden, plaster, or stone surface (such as a wall, a ceiling, or a floor) within range, and lasts for the Duration. You choose the opening's dimensions - up to 5 feet wide, 8 feet tall, and 20 feet deep. The Passage creates no instability in a structure surrounding it.\n\nWhen the opening disappears, any creatures or objects still in the passage created by the spell are safely ejected to an unoccupied space nearest to the surface on which you cast the spell.",
            "duration": "1 hour",
            "level": "5",
            "name": "Passwall",
            "range": "30 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "wizard",
                "level5"
            ],
            "type": "5th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You tap into the nightmares of a creature you can see within range and create an illusory manifestation of its deepest fears, visible only to that creature. The target must make a Wisdom saving throw. On a failed save, the target becomes frightened for the duration. At the start of each of the target's turns before the spell ends, the target must succeed on a Wisdom saving throw or take 4d10 psychic damage. On a successful save, the spell ends.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d10 for each slot level above 4th.",
            "level": "4",
            "name": "Phantasmal Killer",
            "range": "120 feet",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "wizard",
                "level4"
            ],
            "type": "4th-level illusion"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of fleece"
                ],
                "raw": "V, S, M (a bit of fleece)",
                "somatic": true,
                "verbal": true
            },
            "description": "You craft an illusion that takes root in the mind of a creature that you can see within range. The target must make an Intelligence saving throw. On a failed save, you create a phantasmal object, creature, or other visible phenomenon of your choice that is no larger than a 1O-foot cube and that is perceivable only to the target for the duration. This spell has no effect on undead or constructs.\n\nThe phantasm includes sound, temperature, and other stimuli, also evident only to the creature.\n\nThe target can use its action to examine the phantasm with an Intelligence (Investigation) check against your spell save DC. If the check succeeds, the target realizes that the phantasm is an illusion, and the spell ends.\n\nWhile a target is affected by the spell, the target treats the phantasm as if it were real. The target rationalizes any illogical outcomes from interacting with the phantasm. For example, a target attempting to walk across a phantasmal bridge that spans a chasm falls once it steps onto the bridge. If the target survives the fall, it still believes that the bridge exists and comes up with some other explanation for its fall--it was pushed, it slipped, or a strong wind might have knocked it off.\n\nAn affected target is so convinced of the phantasm's reality that it can even take damage from the illusion. A phantasm created to appear as a creature can attack the target. Similarly. a phantasm created to appear as fire, a pool of acid, or lava can burn the target. Each round on your turn, the phantasm can deal 1d6 psychic damage to the target if it is in the phantasm's area or within 5 feet of the phantasm, provided that the illusion is of a creature ar hazard that could logically deal damage, such as by attacking. The target perceives the damage as a type appropriate to the illusion.",
            "duration": "Concentration, up to 1 minute",
            "level": "2",
            "name": "Phantasmal Force",
            "range": "60 feet",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "level2"
            ],
            "type": "2nd-level illusion"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You beseech an otherworldly entity for aid. The being must be known to you - a god, a Primordial, a demon prince, or some other being of cosmic power. That entity sends a Celestial, an elemental, or a fiend loyal to it to aid you, making the creature appear in an unoccupied space within range. If you know a specific creature's name, you can speak that name when you cast this spell to request that creature, though you might get a different creature anyway (DM's choice).\n\nWhen the creature appears, it is under no compulsion to behave in any particular way. You can ask the creature to perform a service in exchange for payment, but it isn’t obliged to do so. The requested task could range from simple (fly us across the chasm, or help us fight a battle) to complex (spy on our enemies, or protect us during our foray into the dungeon). You must be able to communicate with the creature to bargain for its services.\n\nPayment can take a variety of forms. A celestial might require a sizable donation of gold or magic items to an allied temple, while a fiend might demand a living sacrifice or a gift of treasure. Some creatures might exchange their service for a quest undertaken by you. As a rule of thumb, a task that can be measured in minutes requires a payment worth 100 gp per minute. A task measured in hours requires 1,000 gp per hour. And a task measured in days (up to 10 days) requires 10,000 gp per day. The DM can adjust these payments based on the circumstances under which you cast the spell. If the task is aligned with the creature's ethos, the payment might be halved or even waived. Nonhazardous tasks typically require only half the suggested payment, while especially dangerous tasks might require a greater gift. Creatures rarely accept tasks that seem suicidal.\n\nAfter the creature completes the task, or when the agreed-upon duration of service expires, the creature returns to its home plane after reporting back to you, if appropriate to the task and if possible. If you are unable to agree on a price for the creature’s service, the creature immediately returns to its home plane.\n\nA creature enlisted to join your group counts as a member of it, receiving a full share of experience points awarded.",
            "duration": "Instantaneous",
            "level": "6",
            "name": "Planar Ally",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "cleric",
                "level6"
            ],
            "type": "6th-level conjuration"
        },
        {
            "casting_time": "1 hour",
            "classes": [
                "bard",
                "cleric",
                "druid",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a jewel worth at least 1,000 gp, which the spell consumes"
                ],
                "raw": "V, S, M (a jewel worth at least 1,000 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "With this spell, you attempt to bind a celestial, an elemental, a fey, or a fiend to your service. The creature must be within range for the entire casting of the spell. (Typically, the creature is first summoned into the center of an inverted magic circle in order to keep it trapped while this spell is cast.) At the completion of the casting, the target must make a Charisma saving throw. On a failed save, it is bound to serve you for the duration. If the creature was summoned or created by another spell, that spell's duration is extended to match the duration of this spell.\n\nA bound creature must follow your instructions to the best of its ability. You might command the creature to accompany you on an adventure, to guard a location, or to deliver a message. The creature obeys the letter of your instructions, but if the creature is hostile to you, it strives to twist your words to achieve its own objectives. If the creature carries out your instructions completely before the spell ends, it travels to you to report this fact if you are on the same plane of existence. If you are on a different plane of existence, it returns to the place where you bound it and remains there until the spell ends.",
            "duration": "24 hours",
            "higher_levels": "When you cast this spell using a spell slot of a higher level, the duration increases to 10 days with a 6th-level slot, to 30 days with a 7th-level slot, to 180 days with an 8th-level slot, and to a year and a day with a 9th-level spell slot.",
            "level": "5",
            "name": "Planar Binding",
            "range": "60 feet",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "wizard",
                "level5"
            ],
            "type": "5th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a caterpillar cocoon"
                ],
                "raw": "V, S, M (a caterpillar cocoon)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. A shapechanger automatically succeeds on this saving throw.\n\nThe transformation lasts for the duration, or until the target drops to 0 hit points or dies. The new form can be any beast whose challenge rating is equal to or less than the target's (or the target's level, if it doesn\u2019t have a challenge rating). The target's game statistics, including mental ability scores, are replaced by the statistics of the chosen beast. It retains its alignment and personality.\n\nThe target assumes the hit points of its new form. When it reverts to its normal form, the creature returns to the number of hit points it had before it transformed. If it reverts as a result of dropping to 0 hit points, any excess damage carries over to its normal form.\n\nAs long as the excess damage doesn't reduce the creature's normal form to 0 hit points, it isn't knocked unconscious.\n\nThe creature is limited in the actions it can perform by the nature of its new form, and it can't speak, cast spells, or take any other action that requires hands or speech.\n\nThe target's gear melds into the new form. The creature can't activate, use, wield, or otherwise benefit from any of its equipment.",
            "duration": "Concentration, up to 1 hour",
            "level": "4",
            "name": "Polymorph",
            "range": "60 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "druid",
                "sorcerer",
                "wizard",
                "level4"
            ],
            "type": "4th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of fleece and jade dust worth at least 25 gp"
                ],
                "raw": "V, S, M (a bit of fleece and jade dust worth at least 25 gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create an illusion of an object, a creature, or some other visible phenomenon within range that activates when a specific condition occurs. The illusion is imperceptible until then. It must be no larger than a 30-foot cube, and you decide when you cast the spell how the illusion behaves and what sounds it makes. This scripted performance can last up to 5 minutes.\n\nWhen the condition you specify occurs, the illusion springs into existence and performs in the manner you described. Once the illusion finishes performing, it disappears and remains dormant for 10 minutes. After this time, the illusion can be activated again. The triggering condition can be as general or as detailed as you like, though it must be based on visual or audible conditions that occur within 30 feet of the area. For example, you could create an illusion of yourself to appear and warn off others who attempt to open a trapped door, or you could set the illusion to trigger only when a creature says the correct word or phrase.\n\nPhysical interaction with the image reveals it to be an illusion, because things can pass through it. A creature that uses its action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image, and any noise it makes sounds hollow to the creature.",
            "duration": "Until dispelled",
            "level": "6",
            "name": "Programmed Illusion",
            "range": "120 feet",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "wizard",
                "level6"
            ],
            "type": "6th-level illusion"
        },
        {
            "casting_time": "1 hour",
            "classes": [
                "cleric",
                "paladin",
                "bard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a diamond worth at least 500 gp, which the spell consumes"
                ],
                "raw": "V, S, M (a diamond worth at least 500 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "You return a dead creature you touch to life, provided that it has been dead no longer than 10 days. If the creature's soul is both willing and at liberty to rejoin the body, the creature returns to life with 1 hit point.\n\nThis spell also neutralizes any poisons and cures nonmagical diseases that affected the creature at the time it died. This spell doesn't, however, remove magical diseases, curses, or similar effects; if these aren't first removed prior to casting the spell, they take effect when the creature returns to life. The spell can\u2019t return an undead creature to life.\n\nThis spell closes all mortal wounds, but it doesn't restore missing body parts. If the creature is lacking body parts or organs integral for its survival\u2014its head, for instance\u2014the spell automatically fails.\n\nComing back from the dead is an ordeal. The target takes a \u22124 penalty to all attack rolls, saving throws, and ability checks. Every time the target finishes a long rest, the penalty is reduced by 1 until it disappears.",
            "duration": "Instantaneous",
            "level": "5",
            "name": "Raise Dead",
            "range": "Touch",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "cleric",
                "paladin",
                "bard",
                "level5"
            ],
            "type": "5th-level necromancy"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "ranger",
                "paladin",
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a creature. If it is poisoned, you neutralize the poison. If more than one poison afflicts the target, you neutralize one poison that you know is present, or you neutralize one at random. For the duration, the target has advantage on saving throws against being poisoned, and it has resistance to poison damage.",
            "duration": "1 hour",
            "level": "2",
            "name": "Protection from Poison",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "cleric",
                "ranger",
                "paladin",
                "druid",
                "level2"
            ],
            "type": "2nd-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A black beam of enervating energy springs from your finger toward a creature within range. Make a ranged spell attack against the target. On a hit, the target deals only half damage with weapon attacks that use Strength until the spell ends.\n\nAt the end of each of the target's turns, it can make a Constitution saving throw against the spell. On a success, the spell ends.",
            "duration": "Concentration, up to 1 minute",
            "level": "2",
            "name": "Ray of Enfeeblement",
            "range": "60 feet",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "warlock",
                "wizard",
                "level2"
            ],
            "type": "2nd-level necromancy"
        },
        {
            "casting_time": "1 hour",
            "classes": [
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "rare oils and unguents worth at least 1,000 gp, which the spell consumes"
                ],
                "raw": "V, S, M (rare oils and unguents worth at least 1,000 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a dead humanoid or a piece of a dead humanoid. Provided that the creature has been dead no longer than 10 days, the spell forms a new adult body for it and then calls the soul to enter that body. If the target's soul isn't free or willing to do so, the spell fails.\n\nThe magic fashions a new body for the creature to inhabit, which likely causes the creature's race to change. The DM rolls a d100 and consults the following table to determine what form the creature takes when restored to life, or the DM chooses a form.\n\n|d100|Race|\n|--------|---------|\n|01-04|Dragonborn|\n|05-13|Dwarf, hill|\n|14-21|Dwarf, mountain|\n|22-25|Elf, dark|\n|26-34|Elf, high|\n|35-42|Elf, wood|\n|43-46|Gnome, forest|\n|47-52|Gnome, rock|\n|53-56|Half-elf|\n|57-60|Half-orc|\n|61-68|Halfling, lightfoot|\n|69-76|Halfling, stout|\n|77-96|Human|\n|97-00|Tiefling|\n\nThe reincarnated creature recalls its former life and experiences. It retains the capabilities it had in its original form, except it exchanges its original race for the new one and changes its racial traits accordingly.",
            "duration": "Instantaneous",
            "level": "5",
            "name": "Reincarnate",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "level5"
            ],
            "type": "5th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "powdered corn extract and a twisted loop of parchment"
                ],
                "raw": "V, S, M (powdered corn extract and a twisted loop of parchment)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a length of rope that is up to 60 feet long. One end of the rope then rises into the air until the whole rope hangs perpendicular to the ground. At the upper end of the rope, an invisible entrance opens to an extradimensional space that lasts until the spell ends.\n\nThe extradimensional space can be reached by climbing to the top of the rope. The space can hold as many as eight Medium or smaller creatures. The rope can be pulled into the space, making the rope disappear from view outside the space.\n\nAttacks and spells can't cross through the entrance into or out of the extradimensional space, but those inside can see out of it as if through a 3-foot-by-5-foot window centered on the rope.\n\nAnything inside the extradimensional space drops out when the spell ends.",
            "duration": "1 hour",
            "level": "2",
            "name": "Rope Trick",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "wizard",
                "level2"
            ],
            "type": "2nd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several.\n\nMake a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, you create one additional ray for each slot level above 2nd.",
            "level": "2",
            "name": "Scorching Ray",
            "range": "120 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "level2"
            ],
            "type": "2nd-level evocation"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "bard",
                "cleric",
                "druid",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a focus worth at least 1,000 gp, such as a crystal ball, a silver mirror, or a font filled with holy water"
                ],
                "raw": "V, S, M (a focus worth at least 1,000 gp, such as a crystal ball, a silver mirror, or a font filled with holy water)",
                "somatic": true,
                "verbal": true
            },
            "description": "You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it. If a target knows you're casting this spell, it can fail the saving throw voluntarily if it wants to be observed.\n\n|Knowledge|Save Modifier|\n|---|---|\n|Secondhand (you have heard of the target)| +5|\n|Firsthand (you have met the target)| 0|\n|Familiar (you know the target well)| -5|\n|Connection|Save Modifier|\n|Likeness or picture| -2|\n|Possession or garment| -4|\n|Body part, lock of hair, bit of nail, or the like| -10|\n\nOn a successful save, the target isn't affected, and you can't use this spell against it again for 24 hours. On a failed save, the spell creates an invisible sensor within 10 feet of the target. You can see and hear through the sensor as if you were there. The sensor moves with the target, remaining within 10 feet of it for the duration. A creature that can see invisible objects sees the sensor as a luminous orb about the size of your fist.\n\nInstead of targeting a creature, you can choose a location you have seen before as the target of this spell. When you do, the sensor appears at that location and doesn\u2019t move.",
            "duration": "Concentration, up to 10 minutes",
            "level": "5",
            "name": "Scrying",
            "range": "Self",
            "ritual": false,
            "school": "divination",
            "tags": [
                "bard",
                "cleric",
                "druid",
                "warlock",
                "wizard",
                "level5"
            ],
            "type": "5th-level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell allows you to change the appearance of any number of creatures that you can see within range. You give each target you choose a new, illusory appearance. An unwilling target can make a Charisma saving throw, and if it succeeds, it is unaffected by this spell.\n\nThe spell disguises physical appearance as well as clothing, armor, weapons, and equipment. You can make each creature seem 1 foot shorter or taller and appear thin, fat, or in between. You can't change a target's body type, so you must choose a form that has the same basic arrangement of limbs. Otherwise, the extent of the illusion is up to you. The spell lasts for the duration, unless you use your action to dismiss it sooner.\n\nThe changes wrought by this spell fail to hold up to physical inspection. For example, if you use this spell to add a hat to a creature's outfit, objects pass through the hat, and anyone who touches it would feel nothing or would feel the creature's head and hair. If you use this spell to appear thinner than you are, the hand of someone who reaches out to touch you would bump into you while it was seemingly still in midair.\n\nA creature can use its action to inspect a target and make an Intelligence (Investigation) check against your spell save DC. If it succeeds, it becomes aware that the target is disguised.",
            "duration": "8 hours",
            "level": "5",
            "name": "Seeming",
            "range": "30 feet",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "level5"
            ],
            "type": "5th-level illusion"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of tale and a small sprinkling of powdered silver"
                ],
                "raw": "V, S, M (a pinch of tale and a small sprinkling of powdered silver)",
                "somatic": true,
                "verbal": true
            },
            "description": "For the duration, you see invisible creatures and objects as if they were visible, and you can see into the Ethereal Plane. Ethereal creatures and objects appear ghostly and translucent.",
            "duration": "1 hour",
            "level": "2",
            "name": "See Invisibility",
            "range": "Self",
            "ritual": false,
            "school": "divination",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "level2"
            ],
            "type": "2nd-level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a chip of mica"
                ],
                "raw": "V, S, M (a chip of mica)",
                "somatic": true,
                "verbal": true
            },
            "description": "A sudden loud ringing noise, painfully intense, erupts from a point of your choice within range. Each creature in a lO-foot-radius sphere centered on that point must make a Constitution saving throw. A creature takes 3d8 thunder damage on a failed save, or half as much damage on a successful one. A creature made of inorganic material such as stone, crystal, or metal has disadvantage on this saving throw.\n\nA nonmagical object that isn't being worn or carried also takes the damage if it's in the spell's area.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 3rd levei or higher, the damage increases by ld8 for each slot level above 2nd.",
            "level": "2",
            "name": "Shatter",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "bard",
                "sorcerer",
                "warlock",
                "wizard",
                "level2"
            ],
            "type": "2nd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a drop of bitumen and a spider"
                ],
                "raw": "V, S, M (a drop of bitumen and a spider)",
                "somatic": true,
                "verbal": true
            },
            "description": "Until the spell ends, one willing creature you touch gains the ability to move up, down, and across vertical surfaces and upside down along ceilings, while leaving its hands free. The target also gains a climbing speed equal to its walking speed.",
            "duration": "Concentration, up to 1 hour",
            "level": "2",
            "name": "Spider Climb",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "warlock",
                "wizard",
                "level2"
            ],
            "type": "2nd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "seven sharp thorns or seven small twigs, each sharpened to a point"
                ],
                "raw": "V, S, M (seven sharp thorns or seven small twigs, each sharpened to a point)",
                "somatic": true,
                "verbal": true
            },
            "description": "The ground in a 20-foot radius centered on a point within range twists and sprouts hard spikes and thorns. The area becomes difficult terrain for the duration. When a creature moves into or within the area, it takes 2d4 piercing damage for every 5 feet it travels.\n\nThe transformation of the ground is camouflaged to look natural. Any creature that can't see the area at the time the spell is cast must make a Wisdom (Perception) check against your spell save DC to recognize the terrain as hazardous before entering it.",
            "duration": "Concentration, up to 10 minutes",
            "level": "2",
            "name": "Spike Growth",
            "range": "150 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "ranger",
                "level2"
            ],
            "type": "2nd-level transmutation"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "The next time you hit a creature with a melee weapon attack during this spell's duration, your weapon pierces both body and mind, and the attack deals an extra 4d6 psychic damage to the target. The target must make a Wisdom saving throw. On a failed save, it has disadvantage on attack rolls and ability checks, and can't take reactions, until the end of its next turn.",
            "duration": "Concentration, up to 1 minute",
            "level": "4",
            "name": "Staggering Smite",
            "range": "Self",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "paladin",
                "level4"
            ],
            "type": "4th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "soft clay, which must be worked into roughly the desired shape of the stone object"
                ],
                "raw": "V, S, M (soft clay, which must be worked into roughly the desired shape of the stone object)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension and form it into any shape that suits your purpose. So, for example, you could shape a large rock into a weapon, idol, or coffer, or make a small passage through a wall, as long as the wall is less than 5 feet thick. You could also shape a stone door or its frame to seal the door shut. The object you create can have up to two hinges and a latch, but finer mechanical detail isn\u2019t possible.",
            "duration": "Instantaneous",
            "level": "4",
            "name": "Stone Shape",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "cleric",
                "druid",
                "wizard",
                "level4"
            ],
            "type": "4th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a magnifying glass"
                ],
                "raw": "V, S, M (a magnifying glass)",
                "somatic": true,
                "verbal": true
            },
            "description": "A beam of brilliant light flashes out from your hand in a 5-foot-wide, 60-foot-long line. Each creature in the line must make a Constitution saving throw. On a failed save, a creature takes 6d8 radiant damage and is blinded until your next turn. On a successful save, it takes half as much damage and isn't blinded by this spell. Undead and oozes have disadvantage on this saving throw.\n\nYou can create a new line of radiance as your action on any turn until the spell ends.\n\nFor the duration, a mote of brilliant radiance shines in your hand. It sheds bright light in a 30-foot radius and dim light for an additional 30 feet. This light is sunlight.",
            "duration": "Concentration, up to 1 minute",
            "level": "6",
            "name": "Sunbeam",
            "range": "Self (60-foot line)",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "level6"
            ],
            "type": "6th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "ranger",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "diamond dust worth 100 gp, which the spell consumes"
                ],
                "raw": "V, S, M (diamond dust worth 100 gp, which the spell consumes)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell turns the flesh of a willing creature you touch as hard as stone. Until the spell ends, the target has resistance to nonmagical bludgeoning, piercing, and slashing damage.",
            "duration": "Concentration, up to 1 hour",
            "level": "4",
            "name": "Stoneskin",
            "range": "Touch",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "druid",
                "sorcerer",
                "ranger",
                "wizard",
                "level4"
            ],
            "type": "4th-level abjuration"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a quiver containing at least one piece of ammunition"
                ],
                "raw": "V, S, M (a quiver containing at least one piece of ammunition)",
                "somatic": true,
                "verbal": true
            },
            "description": "You transmute your quiver so it produces an endless supply of nonmagical ammunition, which seems to leap into your hand when you reach for it.\n\nOn each of your turns until the spell ends, you can use a bonus action to make two attacks with a weapon that uses ammunition from the quiver. Each time you make such a ranged attack, your quiver magically replaces the piece of ammunition you used with a similar piece of nonmagical ammunition. Any pieces of ammunition created by this spell disintegrate when the spell ends. If the quiver leaves your possession, the spell ends.",
            "duration": "Concentration, up to 1 minute",
            "level": "5",
            "name": "Swift Quiver",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "ranger",
                "level5"
            ],
            "type": "5th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You gain the ability to move or manipulate creatures or objects by thought. When you cast the spell, and as your action each round for the duration, you can exert your will on one creature or object that you can see within range, causing the appropriate effect below. You can affect the same target round after round, or choose a new one at any time. If you switch targets, the prior target is no longer affected by the spell.\n\nCreature: You can try to move a Huge or smaller creature. Make an ability check with your Spellcasting Ability contested by the creature's Strength check. If you win the contest, you move the creature up to 30 feet in any direction, including upward but not beyond the range of this spell. Until the end of your next turn, the creature is Restrained in your Telekinetic grip. A creature lifted upward is suspended in mid-air.\nOn subsequent rounds, you can use your action to attempt to maintain your telekinetic grip on the creature by repeating the contest.\n\nObject: You can try to move an object that weighs up to 1,000 pounds. If the object isn't being worn or carried, you automatically move it up to 30 feet in any direction, but not beyond the range of this spell.\nIf the object is worn or carried by a creature, you must make an ability check with your spellcasting ability contested by that creature’s Strength check. If you succeed, you pull the object away from that creature and can move it up to 30 feet in any direction but not beyond the range of this spell.\n\nYou can exert fine control on objects with your telekinetic grip, such as manipulating a simple tool, opening a door or a container, stowing or retrieving an item from an open container, or pouring the contents from a vial.",
            "duration": "Concentration, up to 10 minutes",
            "level": "5",
            "name": "Telekinesis",
            "range": "60 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "wizard",
                "level5"
            ],
            "type": "5th-level transmutation"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "rare chalks and inks infused with precious gems with 50 gp, which the spell consumes"
                ],
                "raw": "V, M (rare chalks and inks infused with precious gems with 50 gp, which the spell consumes)",
                "somatic": false,
                "verbal": true
            },
            "description": "As you cast the spell, you draw a 10-foot-diameter circle on the ground inscribed with sigils that link your location to a permanent teleportation circle of your choice, whose sigil sequence you know and that is on the same plane of existence as you. A shimmering portal opens within the circle you drew and remains open until the end of your next turn. Any creature that enters the portal instantly appears within 5 feet of the destination circle or in the nearest unoccupied space if that space is occupied.\n\nMany major temples, guilds, and other important places have permanent teleportation circles inscribed somewhere within their confines. Each such circle includes a unique sigil sequence\u2014-a string of magical runes arranged in a particular pattern. When you first gain the ability to cast this spell, you learn the sigil sequences for two destinations on the Material Plane, determined by the DM. You can learn additional sigil sequences during your adventures. You can commit a new sigil sequence to memory after studying it for 1 minute.\n\nYou can create a permanent teleportation circle by casting this spell in the same location every day for one year. You need not use the circle to teleport when you cast the spell in this way.",
            "duration": "1 round",
            "level": "5",
            "name": "Teleportation Circle",
            "range": "10 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "level5"
            ],
            "type": "5th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell creates a magical link between a Large or larger inanimate plant within range and another plant, at any distance, on the same plane of existence. You must have seen or touched the destination plant at least once before. For the duration, any creature can step into the target plant and exit from the destination plant by using 5 feet of movement.",
            "duration": "1 round",
            "level": "6",
            "name": "Transport via Plants",
            "range": "10 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "level6"
            ],
            "type": "6th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You gain the ability to enter a tree and move from inside it to inside another tree of the same kind within 500 feet. Both trees must be living and at least the same size as you. You must use 5 feet of movement to enter a tree. You instantly know the location of all other trees of the same kind within 500 feet and, as part of the move used to enter the tree, can either pass into one of those trees or step out of the tree you're in. You appear in a spot of your choice within 5 feet of the destination tree, using another 5 feet of movement. If you have no movement left, you appear within 5 feet of the tree you entered.\n\nYou can use this transportation ability once per round for the duration. You must end each turn outside a tree.",
            "duration": "Concentration, up to 1 minute",
            "level": "5",
            "name": "Tree Stride",
            "range": "Self",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "ranger",
                "level5"
            ],
            "type": "5th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "an ointment for the eyes that costs 25 gp, is made from mushroom powder, saffron, and fat, and is consumed by the spell"
                ],
                "raw": "V, S, M (an ointment for the eyes that costs 25 gp, is made from mushroom powder, saffron, and fat, and is consumed by the spell)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell gives the willing creature you touch the ability to see things as they actually are. For the duration, the creature has truesight, notices secret doors hidden by magic, and can see into the Ethereal Plane, all out to a range of 120 feet.",
            "duration": "1 hour",
            "level": "6",
            "name": "True Seeing",
            "range": "Touch",
            "ritual": false,
            "school": "divination",
            "tags": [
                "bard",
                "cleric",
                "sorcerer",
                "warlock",
                "wizard",
                "level6"
            ],
            "type": "6th-level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V,S",
                "somatic": true,
                "verbal": true
            },
            "description": "The touch of your shadow-wreathed hand can siphon life force from others to heal your wounds. Make a melee spell attack against a creature within your reach. On a hit, the target takes 3d6 necrotic damage, and you regain hit points equal to half the amount of necrotic damage dealt. Until the spell ends, you can make the attack again on each of your turns as an action.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.",
            "level": "3",
            "name": "Vampiric Touch",
            "range": "Self",
            "ritual": false,
            "school": "necromancy",
            "tags": [
                "warlock",
                "wizard",
                "level3"
            ],
            "type": "3rd-level necromancy"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a small piece of phosphorus"
                ],
                "raw": "V, S, M (a small piece of phosphorus)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a wall of fire on a solid surface within range. You can make the wall up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall is opaque and lasts for the duration.\n\nWhen the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 5d8 fire damage, or half as much damage on a successful save.\n\nOne side of the wall, selected by you when you cast this spell, deals 5d8 fire damage to each creature that ends its turn within 10 feet of that side or inside the wall. A creature takes the same damage when it enters the wall for the first time on a turn or ends its turn there. The other side of the wall deals no damage.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.",
            "level": "4",
            "name": "Wall of Fire",
            "range": "120 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "level4"
            ],
            "type": "4th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a small piece of quartz"
                ],
                "raw": "V, S, M (a small piece of quartz)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a wall of ice on a solid surface within range. You can form it into a hemispherical dome or a sphere with a radius of up to 10 feet, or you can shape a flat surface made up of ten 10-foot-square panels. Each panel must be contiguous with another panel. In any form, the wall is 1 foot thick and lasts for the duration.\n\nIf the wall cuts through a creature\u2019s space when it appears, the creature within its area is pushed to one side of the wall and must make a Dexterity saving throw. On a failed save, the creature takes 10d6 cold damage, or half as much damage on a successful save.\n\nThe wall is an object that can be damaged and thus breached. It has AC 12 and 30 hit points per 10-foot section, and it is vulnerable to fire damage. Reducing a 10-foot section of wall to 0 hit points destroys it and leaves behind a sheet of frigid air in the space the wall occupied. A creature moving through the sheet of frigid air for the first time on a turn must make a Constitution saving throw. That creature takes 5d6 cold damage on a failed save, or half as much damage on a successful one.",
            "duration": "Concentration, up to 10 minutes",
            "higher_levels": "When you cast this spells using a spells slot of 7th level or higher, the damage the wall deals when it appears increases by 2d6, and the damage from passing through the sheet of frigid air increases by 1d6, for each slot level above 6th.",
            "level": "6",
            "name": "Wall of Ice",
            "range": "120 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "wizard",
                "level6"
            ],
            "type": "6th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of powder made by crushing a clear gemstone"
                ],
                "raw": "V, S, M (a pinch of powder made by crushing a clear gemstone)",
                "somatic": true,
                "verbal": true
            },
            "description": "An invisible wall of force springs into existence at a point you choose within range. The wall appears in any orientation you choose, as a horizontal or vertical barrier or at an angle. It can be free floating or resting on a solid surface. You can form it into a hemispherical dome or a sphere with a radius of up to 10 feet, or you can shape a flat surface made up of ten 10-foot-by-10-foot panels. Each panel must be contiguous with another panel. In any form, the wall is 1/4 inch thick. It lasts for the duration. If the wall cuts through a creature\u2019s space when it appears, the creature is pushed to one side of the wall (your choice which side).\n\nNothing can physically pass through the wall. It is immune to all damage and can\u2019t be dispelled by *[dispel magic](../dispel-magic/ \"dispel magic (lvl 3)\")*. A *[disintegrate](../disintegrate/ \"disintegrate (lvl 6)\")* spell destroys the wall instantly, however. The wall also extends into the Ethereal Plane, blocking ethereal travel through the wall.",
            "duration": "Concentration, up to 10 minutes",
            "level": "5",
            "name": "Wall of Force",
            "range": "120 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "wizard",
                "level5"
            ],
            "type": "5th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a small block of granite"
                ],
                "raw": "V, S, M (a small block of granite)",
                "somatic": true,
                "verbal": true
            },
            "description": "A nonmagical wall of solid stone springs into existence at a point you choose within range. The wall is 6 inches thick and is composed of ten 10-foot-by-10-foot panels. Each panel must be contiguous with at least one other panel. Alternatively, you can create 10-foot-by-20-foot panels that are only 3 inches thick.\n\nIf the wall cuts through a creature's space when it appears, the creature is pushed to one side of the wall (your choice). If a creature would be surrounded on all sides by the wall (or the wall and another solid surface), that creature can make a Dexterity saving throw. On a success, it can use its reaction to move up to its speed so that it is no longer enclosed by the wall.\n\nThe wall can have any shape you desire, though it can't occupy the same space as a creature or object. The wall doesn't need to be vertical or rest on any firm foundation. It must, however, merge with and be solidly supported by existing stone. Thus, you can use this spell to bridge a chasm or create a ramp.\n\nIf you create a span greater than 20 feet in length, you must halve the size of each panel to create supports. You can crudely shape the wall to create crenellations, battlements, and so on.\n\nThe wall is an object made of stone that can be damaged and thus breached. Each panel has AC 15 and 30 hit points per inch of thickness. Reducing a panel to 0 hit points destroys it and might cause connected panels to collapse at the DM\u2019s discretion.\n\nIf you maintain your concentration on this spell for its whole duration, the wall becomes permanent and can't be dispelled. Otherwise, the wall disappears when the spell ends.",
            "duration": "Concentration, up to 10 minutes",
            "level": "5",
            "name": "Wall of Stone",
            "range": "120 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "level5"
            ],
            "type": "5th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a handful of thorns"
                ],
                "raw": "V, S, M (a handful of thorns)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a wall of tough, pliable, tangled brush bristling with needle-sharp thorns. The wall appears within range on a solid surface and lasts for the duration. You choose to make the wall up to 60 feet long, 10 feet high, and 5 feet thick or a circle that has a 20-foot diameter and is up to 20 feet high and 5 feet thick. The wall blocks line of sight.\n\nWhen the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 7d8 piercing damage, or half as much damage on a successful save.\n\nA creature can move through the wall, albeit slowly and painfully. For every 1 foot a creature moves through the wall, it must spend 4 feet of movement. Furthermore, the first time a creature enters the wall on a turn or ends its turn there, the creature must make a Dexterity saving throw. It takes 7d8 slashing damage on a failed save, or half as much damage on a successful one.",
            "duration": "Concentration, up to 10 minutes",
            "higher_levels": "When you cast this spell using a spell slot o f 7th level or higher, both types of damage increase by 1d8 for each slot level above 6th.",
            "level": "6",
            "name": "Wall of Thorns",
            "range": "120 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "level6"
            ],
            "type": "6th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a short reed or piece of straw"
                ],
                "raw": "V, S, M (a short reed or piece of straw)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell grants up to ten willing creatures you can see within range the abilily to breathe underwater until the spell ends. Affected creatures also retain their normal mode of respiration.",
            "duration": "24 hours",
            "level": "3",
            "name": "Water Breathing",
            "range": "30 feet",
            "ritual": true,
            "school": "transmutation",
            "tags": [
                "druid",
                "ranger",
                "sorcerer",
                "wizard",
                "level3"
            ],
            "type": "3rd-level transmutation (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric",
                "druid",
                "ranger",
                "sorcerer"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a piece of cork"
                ],
                "raw": "V, S, M (a piece of cork)",
                "somatic": true,
                "verbal": true
            },
            "description": "This spell grants the ability to move across any liquid surface--such as water, acid, mud, snow, quicksand, or lava--as if it were harmless solid ground (creatures crossing molten lava can still take damage from the heal). Up to ten willing creatures you can see within range gain this abilily for the duration.\n\nlf you target a creature submerged in a liquid, the spell carries the target to the surface of the liquid at a rate of 60 feet per round.",
            "duration": "1 hour",
            "level": "3",
            "name": "Water Walk",
            "range": "30 feet",
            "ritual": true,
            "school": "transmutation",
            "tags": [
                "cleric",
                "druid",
                "ranger",
                "sorcerer",
                "level2"
            ],
            "type": "3rd-level transmutation (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of spiderweb"
                ],
                "raw": "V, S, M (a bit of spiderweb)",
                "somatic": true,
                "verbal": true
            },
            "description": "You conjure a mass of thick, sticky webbing at a point of your choice within range. The webs fill a 20-foot cube from that point for the duration. The webs are difficult terrain and lightly obscure their area.\n\nIf the webs aren't anchored between two solid masses (such as walls or trees) or layered across a floor, wall, or ceiling, the conjured web collapses on itself, and the spell ends at the start of your next turn. Webs layered over a flat surface have a depth of 5 feet.\n\nEach creature that starts its turn in the webs or that enters them during its turn must make a Dexterity saving throw. On a failed save, the creature is restrained as long as it remains in the webs or until it breaks free.\n\nA creature restrained by the webs can use its action to make a Strength cheek against your spell save DC. If it suceeeds, it is no longer restrained.\n\nThe webs are flammable. Any 5-foot cube of webs exposed to fire burns away in 1 round, dealing 2d4 fire damage to any creature that starts its turn in the fire.",
            "duration": "Concentration, up to 1 hour",
            "level": "2",
            "name": "Web",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "sorcerer",
                "wizard",
                "level2"
            ],
            "type": "2nd-level conjuration"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "fire and holy water"
                ],
                "raw": "V, S, M (fire and holy water)",
                "somatic": true,
                "verbal": true
            },
            "description": "You and up to ten willing creatures you can see within range assume a gaseous form for the duration, appearing as wisps of cloud. While in this cloud form, a creature has a flying speed of 300 feet and has resistance to damage from nonmagical weapons. The only actions a creature can take in this form are the Dash action or to revert to its normal form. Reverting takes 1 minute, during which time a creature is incapacitated and can\u2019t move. Until the spell ends, a creature can revert to cloud form, which also requires the 1-minute transformation.\n\nIf a creature is in cloud form and flying when the effect ends, the creature descends 60 feet per round for 1 minute until it lands, which it does safely. If it can\u2019t land after 1 minute, the creature falls the remaining distance.",
            "duration": "8 hours",
            "level": "6",
            "name": "Wind Walk",
            "range": "30 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "level6"
            ],
            "type": "6th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a tiny fan and a feather of exotic origin"
                ],
                "raw": "V, S, M (a tiny fan and a feather of exotic origin)",
                "somatic": true,
                "verbal": true
            },
            "description": "A wall of strong wind rises from the ground at a point you choose within range. You can make the wall up to 50 feet long, 15 feet high, and 1 foot thick. You can shape the wall in any way you choose so long as it makes one continuous path along the ground. The wall lasts for the duration.\n\nWhen the wall appears, each creature within its area must make a Strength saving throw. A creature takes 3d8 bludgeoning damage on a failed save, or half as much damage on a successful one.\n\nThe strong wind keeps fog, smoke, and other gases at bay. Small or smaller flying creatures or objects can't pass through the wall. Loose, lightweight materials brought into the wall fly upward. Arrows, bolts, and other ordinary projectiles launched at targets behind the wall are deflected upward and automatically miss. (Boulders hurled by giants or siege engines, and similar projectiles, are unaffected.) Creatures in gaseous form can\u2019t pass through it.",
            "duration": "Concentration, up to 1 minute",
            "level": "3",
            "name": "Wind Wall",
            "range": "120 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "druid",
                "ranger",
                "level3"
            ],
            "type": "3rd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "cleric"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "You and up to five willing creatures within 5 feet of you instantly teleport to a previously designated sanctuary. You and any creatures that teleport with you appear in the nearest unoccupied space to the spot you designated when you prepared your sanctuary (see below). If you cast this spell without first preparing a sanctuary, the spell has no effect.\n\nYou must designate a sanctuary by casting this spell within a location, such as a temple, dedicated to or strongly linked to your deity. If you attempt to cast the spell in this manner in an area that isn\u2019t dedicated to your deity, the spell has no effect.",
            "duration": "Instantaneous",
            "level": "6",
            "name": "Word of Recall",
            "range": "5 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "cleric",
                "level6"
            ],
            "type": "6th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "cleric",
                "paladin"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a magical zone that guards against deception in a 15-foot-radius sphere centered on a point of your choice within range. Until the spell ends, a creature that enters the spell's area for the first time on turn or starts its turn there must make a Charisma saving throw. On a failed save, a creature can't speak a deliberate lie while in the radius. you know whether each creature succeeds or fails on its saving throw.\n\nAn affected creature is aware of the spell and can thus avoid answering questions to which it would normally respond with a lie. Such a creature can be evasive in its answers as long as it remains within the boundaries of the truth.",
            "duration": "10 minutes",
            "level": "2",
            "name": "Zone of Truth",
            "range": "60 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "bard",
                "cleric",
                "paladin",
                "level2"
            ],
            "type": "2nd-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You cause a tremor in the ground in a 10-foot radius. Each creature other than you in that area must make a Dexterity saving throw. On a failed save, a creature takes 1d6 bludgeoning damage and is knocked prone. If the ground in that area is loose earth or stone, it becomes difficult terrain until cleared.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
            "level": "1",
            "name": "Earth Tremor",
            "range": "Self (10-foot radius)",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "bard",
                "druid",
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Choose an area of flame that you can see and that can fit within a 5-foot cube within range. You can extinguish the fire in that area, and you create either fireworks or smoke.",
            "duration": "Instantaneous",
            "level": "2",
            "name": "Pyrotechnics",
            "range": "60 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "bard",
                "sorcerer",
                "wizard",
                "level2"
            ],
            "type": "2nd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You cause up to ten words to form in a part of the sky you can see. The words appear to be made of cloud and remain in place for the spell\u2019s duration. The words dissipate when the spell ends. A strong wind can disperse the clouds and end the spell early",
            "duration": "Concentration, up to 1 hour",
            "level": "2",
            "name": "Skywrite",
            "range": "Sight",
            "ritual": true,
            "school": "transmutation",
            "tags": [
                "bard",
                "druid",
                "wizard",
                "level2"
            ],
            "type": "2nd-level transmutation (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "S",
                "somatic": true,
                "verbal": false
            },
            "description": "You create a burst of thunderous sound, which can be heard 100 feet away. Each creature other than you within 5 feet of you must make a Constitution saving throw. On a failed save, the creature takes 1d6 thunder damage.\n\nThe spell\u2019s damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Thunderclap",
            "range": "Self (5-foot radius)",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "bard",
                "druid",
                "sorcerer",
                "warlock",
                "wizard",
                "cantrip"
            ],
            "type": "Evocation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "bard",
                "druid",
                "sorcerer"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "A strong wind (20 miles per hour) blows around you in a 10-foot radius and moves with you, remaining centered on you. The wind lasts for the spell\u2019s duration.\n\n* It deafens you and other creatures in its area.\n\n* It extinguishes unprotected flames in its area that are torch-sized or smaller.\n\n* The area is difficult terrain for creatures other than you.\n\n* The attack rolls of ranged weapon attacks have disadvantage if they pass in or out of the wind.\n\n* It hedges out vapor, gas, and fog that can be dispersed by strong wind.",
            "duration": "Concentration, up to 10 minutes",
            "level": "2",
            "name": "Warding Wind",
            "range": "Self",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "bard",
                "druid",
                "sorcerer",
                "level2"
            ],
            "type": "2nd level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "S",
                "somatic": true,
                "verbal": false
            },
            "description": "* You instantaneously expand the flame 5 feet in one direction, provided that wood or other fuel is present in the new location.\n\n* You instantaneously extinguish the flames within the cube.\n\n* You double or halve the area of bright light and dim light cast by the flame, change its color, or both. The change lasts for 1 hour.\n\n* You cause simple shapes\u2014such as the vague form of a creature, an inanimate object, or a location\u2014to appear within the flames and animate as you like. The shapes last for 1 hour.\n\nIf you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at a time, and you can dismiss such an effect as an action.",
            "duration": "Instantaneous or 1 hour (see below)",
            "level": "cantrip",
            "name": "Control Flames",
            "range": "60 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "cantrip"
            ],
            "type": "Transmutation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a bonfire on ground that you can see within range. Until the spell ends, the bonfire fills a 5-foot cube. Any creature in the bonfire\u2019s space when you cast the spell must succeed on a Dexterity saving throw or take 1d8 fire damage. A creature must also make the saving throw when it enters the bonfire\u2019s space for the first time on a turn or ends its turn there.\n\nThe spell\u2019s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
            "duration": "Concentration, up to 1 minute",
            "level": "cantrip",
            "name": "Create Bonfire",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard",
                "cantrip"
            ],
            "type": "Conjuration cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You cause numbing frost to form on one creature that you can see within range. The target must make a Constitution saving throw. On a failed save, the target takes 1d6 cold damage, and it has disadvantage on the next weapon attack roll it makes before the end of its next turn.\n\nThe spell\u2019s damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Frostbite",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard",
                "cantrip"
            ],
            "type": "Evocation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "* One Medium or smaller creature that you choose must succeed on a Strength saving throw or be pushed up to 5 feet away from you.\n\n* You create a small blast of air capable of moving one object that is neither held nor carried and that weighs no more than 5 pounds. The object is pushed up to 10 feet away from you. It isn\u2019t pushed with enough force to cause damage.\n\n* You create a harmless sensory affect using air, such as causing leaves to rustle, wind to slam shutters shut, or your clothing to ripple in a breeze.",
            "duration": "Instantaneous",
            "level": "cantrip",
            "name": "Gust",
            "range": "30 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "cantrip"
            ],
            "type": "Transmutation cantrip"
        },
        {
            "casting_time": "1 bonus action",
            "classes": [
                "druid",
                "warlock"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch one to three pebbles and imbue them with magic. You or someone else can make a ranged spell attack with one of the pebbles by throwing it or hurling it with a sling. If thrown, it has a range of 60 feet. If someone else attacks with the pebble, that attacker adds your spellcasting ability modifier, not the attacker\u2019s, to the attack roll. On a hit, the target takes bludgeoning damage equal to 1d6 + your spellcasting ability modifier. Hit or miss, the spell then ends on the stone.\n\nIf you cast this spell again, the spell ends early on any pebbles still affected by it.",
            "duration": "1 minute",
            "level": "cantrip",
            "name": "Magic Stone",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "warlock",
                "cantrip"
            ],
            "type": "Transmutation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "S",
                "somatic": true,
                "verbal": false
            },
            "description": "* If you target an area of loose earth, you can instantaneously excavate it, move it along the ground, and deposit it up to 5 feet away. This movement doesn\u2019t have enough force to cause damage.\n\n* You cause shapes, colors, or both to appear on the dirt or stone, spelling out words, creating images, or shaping patterns. The changes last for 1 hour.\n\n* If the dirt or stone you target is on the ground, you cause it to become difficult terrain. Alternatively, you can cause the ground to become normal terrain if it is already difficult terrain. This change lasts for 1 hour.\n\nIf you cast this spell multiple times, you can have no more than two of its non-instantaneous effects active at a time, and you can dismiss such an effect as an action.",
            "duration": "Instantaneous or 1 hour (see below)",
            "level": "cantrip",
            "name": "Mold Earth",
            "range": "30 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "cantrip"
            ],
            "type": "Transmutation cantrip"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "S",
                "somatic": true,
                "verbal": false
            },
            "description": "* You instantaneously move or otherwise change the flow of the water as you direct, up to 5 feet in any direction. This movement doesn\u2019t have enough force to cause damage.\n\n* You cause the water to form into simple shapes and animate at your direction. This change lasts for 1 hour.\n\n* You change the water\u2019s color or opacity. The water must be changed in the same way throughout. This change lasts for 1 hour.\n\n* You freeze the water, provided that there are no creatures in it. The water unfreezes in 1 hour.\n\nIf you cast this spell multiple times, you can have no more than two of its non-instantaneous effects active at a time, and you can dismiss such an effect as an action.",
            "duration": "Instantaneous or 1 hour (see below)",
            "level": "cantrip",
            "name": "Shape Water",
            "range": "30 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "cantrip"
            ],
            "type": "Transmutation cantrip"
        },
        {
            "casting_time": "1 reaction, which you take when you take acid, cold, fire, lightning, or thunder damage",
            "classes": [
                "druid",
                "ranger",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "S",
                "somatic": true,
                "verbal": false
            },
            "description": "The spell captures some of the incoming energy, lessening its effect on you and storing it for your next melee attack. You have resistance to the triggering damage type until the start of your next turn. Also, the first time you hit with a melee attack on your next turn, the target takes an extra 1d6 damage of the triggering type, and the spell ends.",
            "duration": "1 round",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each slot level above 1st.",
            "level": "1",
            "name": "Absorb Elements",
            "range": "Self",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "druid",
                "ranger",
                "wizard",
                "level1"
            ],
            "type": "1st-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a bit of fur wrapped in a cloth"
                ],
                "raw": "V, S, M (a bit of fur wrapped in a cloth)",
                "somatic": true,
                "verbal": true
            },
            "description": "You establish a telepathic link with one beast you touch that is friendly to you or charmed by you. The spell fails if the beast\u2019s Intelligence is 4 or higher. Until the spell ends, the link is active while you and the beast are within line of sight of each other. Through the link, the beast can understand your telepathic messages to it, and it can telepathically communicate simple emotions and concepts back to you. While the link is active, the beast gains advantage on attack rolls against any creature within 5 feet of you that you can see.",
            "duration": "Concentration, up to 10 minutes",
            "level": "1",
            "name": "Beast Bond",
            "range": "Touch",
            "ritual": false,
            "school": "divination",
            "tags": [
                "druid",
                "ranger",
                "level1"
            ],
            "type": "1st-level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a drop of water or piece of ice"
                ],
                "raw": "S, M (a drop of water or piece of ice)",
                "somatic": true,
                "verbal": false
            },
            "description": "You create a shard of ice and fling it at one creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 piercing damage. Hit or miss, the shard then explodes. The target and each creature within 5 feet of the point where the ice exploded must succeed on a Dexterity saving throw or take 2d6 cold damage.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the cold damage increases by 1d6 for each slot level above 1st.",
            "level": "1",
            "name": "Ice Knife",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "Choose one creature you can see within range. Yellow strips of magical energy loop around the creature. The target must succeed on a Strength saving throw or its flying speed (if any) is reduced to 0 feet for the spell\u2019s duration. An airborne creature affected by this spell descends at 60 feet per round until it reaches the ground or the spell ends.",
            "duration": "Concentration, up to 1 minute",
            "level": "2",
            "name": "Earthbind",
            "range": "300 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard",
                "level2"
            ],
            "type": "2nd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a pinch of dust"
                ],
                "raw": "V, S, M (a pinch of dust)",
                "somatic": true,
                "verbal": true
            },
            "description": "Choose an unoccupied 5-foot cube of air that you can see within range. An elemental force that resembles a dust devil appears in the cube and lasts for the spell\u2019s duration.\n\nAny creature that ends its turn within 5 feet of the dust devil must make a Strength saving throw. On a failed save, the creature takes 1d8 bludgeoning damage and is pushed 10 feet away. On a successful save, the creature takes half as much damage and isn\u2019t pushed.\n\nAs a bonus action, you can move the dust devil up to 30 feet in any direction. If the dust devil moves over sand, dust, loose dirt, or small gravel, it sucks up the material and forms a 10-foot-radius cloud of debris around itself that lasts until the start of your next turn. The cloud heavily obscures its area.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.",
            "level": "2",
            "name": "Dust Devil",
            "range": "60 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "level2"
            ],
            "type": "2nd-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "S",
                "somatic": true,
                "verbal": false
            },
            "description": "Choose one object weighing 1 to 5 pounds within range that isn\u2019t being worn or carried. The object flies in a straight line up to 90 feet in a direction you choose before falling to the ground, stopping early if it impacts against a solid surface. If the object would strike a creature, that creature must make a Dexterity saving throw. On a failed save, the object strikes the target and stops moving. In either case, both the object and the creature or solid surface take 3d8 bludgeoning damage.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 2nd level or higher, the maximum weight of objects that you can target with this spell increases by 5 pounds, and the damage increases by 1d8, for each slot level above 1st.",
            "level": "1",
            "name": "Catapult",
            "range": "150 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "sorcerer",
                "wizard",
                "level1"
            ],
            "type": "1st-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You take control of the air in a 100-foot cube that you can see within range. Choose one of the following effects when you cast the spell. The effect lasts for the spell\u2019s duration, unless you use your action on a later turn to switch to a different effect. You can also use your action to temporarily halt the effect or to restart one you\u2019ve halted.",
            "duration": "Concentration, up to 1 hour",
            "level": "5",
            "name": "Control Winds",
            "range": "300 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "level5"
            ],
            "type": "5th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You cause up to six pillars of stone to burst from places on the ground that you can see within range. Each pillar is a cylinder that has a diameter of 5 feet and a height of up to 30 feet. The ground where a pillar appears must be wide enough for its diameter, and you can target ground under a creature if that creature is Medium or smaller. Each pillar has AC 5 and 30 hit points. When reduced to 0 hit points, a pillar crumbles into rubble, which creates an area of difficult terrain with a 10-foot radius. The rubble lasts until cleared.\n\nIf a pillar is created under a creature, that creature must succeed on a Dexterity saving throw or be lifted by the pillar. A creature can choose to fail the save.\n\nIf a pillar is prevented from reaching its full height because of a ceiling or other obstacle, a creature on the pillar takes 6d6 bludgeoning damage and is restrained, pinched between the pillar and the obstacle. The restrained creature can use an action to make a Strength or Dexterity check (the creature\u2019s choice) against the spell\u2019s saving throw DC. On a success, the creature is no longer restrained and must either move off the pillar or fall off it.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 7th level or higher, you can create two additional pillars for each slot level above 6th.",
            "level": "6",
            "name": "Bones of the Earth",
            "range": "120 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "level6"
            ],
            "type": "6th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a piece of obsidian"
                ],
                "raw": "V, S, M (a piece of obsidian)",
                "somatic": true,
                "verbal": true
            },
            "description": "Choose a point you can see on the ground within range. A fountain of churned earth and stone erupts in a 20-foot cube centered on that point. Each creature in that area must make a Dexterity saving throw. A creature takes 3d12 bludgeoning damage on a failed save, or half as much damage on a successful one. Additionally, the ground in that area becomes difficult terrain until cleared away. Each 5-foot-square portion of the area requires at least 1 minute to clear by hand.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d12 for each slot level above 2nd.",
            "level": "3",
            "name": "Erupting Earth",
            "range": "120 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "level3"
            ],
            "type": "3rd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "Choose one creature you can see within range, and choose one of the following damage types: acid, cold, fire, lightning, or thunder. The target must succeed on a Constitution saving throw or be affected by the spell for its duration. The first time each turn the affected target takes damage of the chosen type, the target takes an extra 2d6 damage of that type. Moreover, the target loses any resistance to that damage type until the spell ends.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th. The creatures must be within 30 feet of each other when you target them.",
            "level": "4",
            "name": "Elemental Bane",
            "range": "90 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "warlock",
                "wizard",
                "level4"
            ],
            "type": "4th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "ranger",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch a quiver containing arrows or bolts. When a target is hit by a ranged weapon attack using a piece of ammunition drawn from the quiver, the target takes an extra 1d6 fire damage. The spell\u2019s magic ends on the piece of ammunition when it hits or misses, and the spell ends when twelve pieces of ammunition have been drawn from the quiver.",
            "duration": "Concentration, up to 1 hour",
            "higher_levels": "When you cast this spell using a spell slot of 4th level or higher, the number of pieces of ammunition you can affect with this spell increases by two for each slot level above 3rd.",
            "level": "3",
            "name": "Flame Arrows",
            "range": "Touch",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "ranger",
                "sorcerer",
                "wizard",
                "level3"
            ],
            "type": "3rd-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "* You are immune to fire damage and have resistance to cold damage.\n\n* Any creature that moves within 5 feet of you for the first time on a turn or ends its turn there takes 1d10 fire damage.\n\n* You can use your action to create a line of fire 15 feet long and 5 feet wide extending from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 4d8 fire damage on a failed save, or half as much damage on a successful one.",
            "duration": "Concentration, up to 10 minutes",
            "level": "6",
            "name": "Investiture of Flame",
            "range": "Self",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard",
                "level6"
            ],
            "type": "6th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "* You are immune to cold damage and have resistance to fire damage.\n\n* You can move across difficult terrain created by ice or snow without spending extra movement.\n\n* The ground in a 10-foot radius around you is icy and is difficult terrain for creatures other than you. The radius moves with you.\n\n* You can use your action to create a 15-foot cone of freezing wind extending from your outstretched hand in a direction you choose. Each creature in the cone must make a Constitution saving throw. A creature takes 4d6 cold damage on a failed save, or half as much damage on a successful one. A creature that fails its save against this effect has its speed halved until the start of your next turn.",
            "duration": "Concentration, up to 10 minutes",
            "level": "6",
            "name": "Investiture of Ice",
            "range": "Self",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard",
                "level6"
            ],
            "type": "6th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "* You have resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.\n\n* You can use your action to create a small earthquake on the ground in a 15-foot radius centered on you. Other creatures on that ground must succeed on a Dexterity saving throw or be knocked prone.\n\n* You can move across difficult terrain made of earth or stone without spending extra movement. You can move through solid earth or stone as if it was air and without destabilizing it, but you can\u2019t end your movement there. If you do so, you are ejected to the nearest unoccupied space, this spell ends, and you are stunned until the end of your next turn",
            "duration": "Concentration, up to 10 minutes",
            "level": "6",
            "name": "Investiture of Stone",
            "range": "Self",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard",
                "level6"
            ],
            "type": "6th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "* Ranged weapon attacks made against you have disadvantage on the attack roll.\n\n* You gain a flying speed of 60 feet. If you are still flying when the spell ends, you fall, unless you can somehow prevent it.\n\n* You can use your action to create a 15-foot cube of swirling wind centered on a point you can see within 60 feet of you. Each creature in that area must make a Constitution saving throw. A creature takes 2d10 bludgeoning damage on a failed save, or half as much damage on a successful one. If a Large or smaller creature fails the save, that creature is also pushed up to 10 feet away from the center of the cube.",
            "duration": "Concentration, up to 10 minutes",
            "level": "6",
            "name": "Investiture of Wind",
            "range": "Self",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "sorcerer",
                "warlock",
                "wizard",
                "level6"
            ],
            "type": "6th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "paper or leaf in the shape of a funnel"
                ],
                "raw": "V, S, M (paper or leaf in the shape of a funnel)",
                "somatic": true,
                "verbal": true
            },
            "description": "A mass of 5-foot-deep water appears and swirls in a 30-foot radius centered on a point you can see within range. The point must be on ground or in a body of water. Until the spell ends, that area is difficult terrain, and any creature that starts its turn there must succeed on a Strength saving throw or take 6d6 bludgeoning damage and be pulled 10 feet toward the center.",
            "duration": "Concentration, up to 1 minute",
            "level": "5",
            "name": "Maelstrom",
            "range": "120 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "druid",
                "level5"
            ],
            "type": "5th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "You have resistance to acid, cold, fire, lightning, and thunder damage for the spell\u2019s duration.\n\nWhen you take damage of one of those types, you can use your reaction to gain immunity to that type of damage, including against the triggering damage. If you do so, the resistances end, and you have the immunity until the end of your next turn, at which time the spell ends.",
            "duration": "Concentration, up to 1 minute",
            "level": "6",
            "name": "Primordial Ward",
            "range": "Self",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "druid",
                "level6"
            ],
            "type": "6th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a drop of water"
                ],
                "raw": "V, S, M (a drop of water)",
                "somatic": true,
                "verbal": true
            },
            "description": "You conjure up a wave of water that crashes down on an area within range. The area can be up to 30 feet long, up to 10 feet wide, and up to 10 feet tall. Each creature in that area must make a Dexterity saving throw. On a failure, a creature takes 4d8 bludgeoning damage and is knocked prone. On a success, a creature takes half as much damage and isn\u2019t knocked prone. The water then spreads out across the ground in all directions, extinguishing unprotected flames in its area and within 30 feet of it.",
            "duration": "Instantaneous",
            "level": "3",
            "name": "Tidal Wave",
            "range": "120 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "wizard",
                "level3"
            ],
            "type": "3rd-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "clay and water"
                ],
                "raw": "V, S, M (clay and water)",
                "somatic": true,
                "verbal": true
            },
            "description": "You choose an area of stone or mud that you can see that fits within a 40-foot cube and that is within range, and choose one of the following effects.\n\nIf you cast the spell on an area of ground, it becomes muddy enough that creatures can sink into it. Each foot that a creature moves through the mud costs 4 feet of movement, and any creature on the ground when you cast the spell must make a Strength saving throw. A creature must also make this save the first time it enters the area on a turn or ends its turn there. On a failed save, a creature sinks into the mud and is restrained, though it can use an action to end the restrained condition on itself by pulling itself free of the mud.\n\nIf you cast the spell on a ceiling, the mud falls. Any creature under the mud when it falls must make a Dexterity saving throw. A creature takes 4d8 bludgeoning damage on a failed save, or half as much damage on a successful one.",
            "duration": "Instantaneous",
            "level": "5",
            "name": "Transmute Rock",
            "range": "120 feet",
            "ritual": false,
            "school": "transmutation",
            "tags": [
                "druid",
                "wizard",
                "level5"
            ],
            "type": "5th-level transmutation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a drop of water"
                ],
                "raw": "V, S, M (a drop of water)",
                "somatic": true,
                "verbal": true
            },
            "description": "You conjure up a wall of water on the ground at a point you can see within range. You can make the wall up to 30 feet long, 10 feet high, and 1 foot thick, or you can make a ringed wall up to 20 feet in diameter  20 feet high, and 1 foot thick. The wall vanishes when the spell ends. The wall\u2019s space is difficult terrain.\n\nAny ranged weapon attack that enters the wall\u2019s space has disadvantage on the attack roll, and fire damage is halved if the fire effect passes through the wall to reach its target. Spells that deal cold damage that pass through the wall cause the area of the wall they pass through to freeze solid (at least a 5-foot square section is frozen). Each 5-foot-square frozen section has AC 5 and 15 hit points. Reducing a frozen section to 0 hit points destroys it. When a section is destroyed, the wall\u2019s water doesn\u2019t fill it.",
            "duration": "Concentration, up to 10 minutes",
            "level": "3",
            "name": "Wall of Water",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "level3"
            ],
            "type": "3rd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a droplet of water"
                ],
                "raw": "V, S, M (a droplet of water)",
                "somatic": true,
                "verbal": true
            },
            "description": "You conjure up a sphere of water with a 10-foot radius on a point you can see within range. The sphere can hover in the air, but no more than 10 feet off the ground. The sphere remains for the spell\u2019s duration.\n\nAny creature in the sphere\u2019s space must make a Strength saving throw. On a successful save, a creature is ejected from that space to the nearest unoccupied space outside it. A Huge or larger creature succeeds on the saving throw automatically. On a failed save, a creature is restrained by the sphere and is engulfed by the water. At the end of each of its turns, a restrained target can repeat the saving throw.\n\nThe sphere can restrain a maximum of four Medium or smaller creatures or one Large creature. If the sphere restrains a creature in excess of these numbers, a random creature that was already restrained by the sphere falls out of it and lands prone in a space within 5 feet of it.\n\nAs an action, you can move the sphere up to 30 feet in a straight line. If it moves over a pit, cliff, or other drop, it safely descends until it is hovering 10 feet over ground. Any creature restrained by the sphere moves with it. You can ram the sphere into creatures, forcing them to make the saving throw, but no more than once per turn.\n\nWhen the spell ends, the sphere falls to the ground and extinguishes all normal flames within 30 feet of it. Any creature restrained by the sphere is knocked prone in the space where it falls.",
            "duration": "Concentration, up to 1 minute",
            "level": "4",
            "name": "Watery Sphere",
            "range": "90 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "druid",
                "sorcerer",
                "wizard",
                "level4"
            ],
            "type": "4th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "druid",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a piece of straw"
                ],
                "raw": "V, M (a piece of straw)",
                "somatic": false,
                "verbal": true
            },
            "description": "A whirlwind howls down to a point on the ground you specify. The whirlwind is a 10-foot-radius, 30-foot-high cylinder centered on that point. Until the spell ends, you can use your action to move the whirlwind up to 30 feet in any direction along the ground. The whirlwind sucks up any Medium or smaller objects that aren\u2019t secured to anything and that aren\u2019t worn or carried by anyone.\n\nA creature must make a Dexterity saving throw the first time on a turn that it enters the whirlwind or that the whirlwind enters its space, including when the whirlwind first appears. A creature takes 10d6 bludgeoning damage on a failed save, or half as much damage on a successful one. In addition, a Large or smaller creature that fails the save must succeed on a Strength saving throw or become restrained in the whirlwind until the spell ends. When a creature starts its turn restrained by the whirlwind, the creature is pulled 5 feet higher inside it, unless the creature is at the top. A restrained creature moves with the whirlwind and falls when the spell ends, unless the creature has some means to stay aloft.\n\nA restrained creature can use an action to make a Strength or Dexterity check against your spell save DC. If successful, the creature is no longer restrained by the whirlwind and is hurled 3d6 \u00d7 10 feet away from it in a random direction.",
            "duration": "Concentration, up to 1 minute",
            "level": "7",
            "name": "Whirlwind",
            "range": "300 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "druid",
                "wizard",
                "level7"
            ],
            "type": "7th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "Flames wreathe one creature you can see within range. The target must make a Dexterity saving throw. It takes 7d6 fire damage on a failed save, or half as much damage on a successful one. On a failed save, the target also burns for the spell\u2019s duration. The burning target sheds bright light in a 30-foot radius and dim light for an additional 30 feet. At the end of each of its turns, the target repeats the saving throw. It takes 3d6 fire damage on a failed save, and the spell ends on a successful one. These magical flames can\u2019t be extinguished through nonmagical means.\n\nIf damage from this spell reduces a target to 0 hit points, the target is turned to ash.",
            "duration": "Concentration, up to 1 minute",
            "level": "5",
            "name": "Immolation",
            "range": "90 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "level5"
            ],
            "type": "5th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": false,
                "raw": "V, S",
                "somatic": true,
                "verbal": true
            },
            "description": "A 20-foot-radius sphere of whirling air springs into existence centered on a point you choose within range. The sphere remains for the spell\u2019s duration. Each creature in the sphere when it appears or that ends its turn there must succeed on a Strength saving throw or take 2d6 bludgeoning damage. The sphere\u2019s space is difficult terrain.\n\nUntil the spell ends, you can use a bonus action on each of your turns to cause a bolt of lightning to leap from the center of the sphere toward one creature you choose within 60 feet of the center. Make a ranged spell attack. You have advantage on the attack roll if the target is in the sphere. On a hit, the target takes 4d6 lightning damage.\n\nCreatures within 30 feet of the sphere have disadvantage on Wisdom (Perception) checks made to listen.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 5th level or higher, the damage increases for each of its effects by 1d6 for each slot level above 4th.",
            "level": "4",
            "name": "Storm Sphere",
            "range": "150 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "level4"
            ],
            "type": "4th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "sorcerer",
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a drop of giant slug bile"
                ],
                "raw": "V, S, M (a drop of giant slug bile)",
                "somatic": true,
                "verbal": true
            },
            "description": "You point at a place within range, and a glowing 1-foot ball of emerald acid streaks there and explodes in a 20-foot radius. Each creature in that area must make a Dexterity saving throw. On a failed save, a creature takes 10d4 acid damage and 5d4 acid damage at the end of its next turn. On a successful save, a creature takes half the initial damage and no damage at the end of its next turn.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 5th level or higher, the initial damage increases by 2d4 for each slot level above 4th.",
            "level": "4",
            "name": "Vitriolic Sphere",
            "range": "150 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "sorcerer",
                "wizard",
                "level4"
            ],
            "type": "4th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "a handful of sand"
                ],
                "raw": "V, S, M (a handful of sand)",
                "somatic": true,
                "verbal": true
            },
            "description": "You conjure up a wall of swirling sand on the ground at a point you can see within range. You can make the wall up to 30 feet long, 10 feet high, and 10 feet thick, and it vanishes when the spell ends. It blocks line of sight but not movement. A creature is blinded while in the wall\u2019s space and must spend 3 feet of movement for every 1 foot it moves there.",
            "duration": "Concentration, up to 10 minutes",
            "level": "3",
            "name": "Wall of Sand",
            "range": "90 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "wizard",
                "level3"
            ],
            "type": "3rd-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "an eggshell and a snakeskin glove"
                ],
                "raw": "V, S, M (an eggshell and a snakeskin glove)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a Large hand of shimmering, translucent force in an unoccupied space that you can see within range. The hand lasts for the spell’s duration, and it moves at your command, mimicking the movements of your own hand. \n\nThe hand is an object that has AC 20 and hit points equal to your hit point maximum. If it drops to 0 hit points, the spell ends. It has a Strength of 26 (+8) and a Dexterity of 10 (+0). The hand doesn’t fill its space.\n\nWhen you cast the spell and as a bonus action on your subsequent turns, you can move the hand up to 60 feet and then cause one of the following effects with it.\n\nClenched Fist. The hand strikes one creature or object within 5 feet of it. Make a melee spell attack for the hand using your game statistics. On a hit, the target takes 4d8 force damage.\n\nForceful Hand. The hand attempts to push a creature within 5 feet of it in a direction you choose. Make a check with the hand’s Strength contested by the Strength (Athletics) check of the target. If the target is Medium or smaller, you have advantage on the check. If you succeed, the hand pushes the target up to 5 feet plus a number of feet equal to five times your spellcasting ability modifier. The hand moves with the target to remain within 5 feet of it.\n\nGrasping Hand. The hand attempts to grapple a Huge or smaller creature within 5 feet of it. You use the hand’s Strength score to resolve the grapple. If the target is Medium or smaller, you have advantage on the check. While the hand is grappling the target, you can use a bonus action to have the hand crush it. When you do so, the target takes bludgeoning damage equal to 2d6 + your spellcasting ability modifier.\n\nInterposing Hand. The hand interposes itself between you and a creature you choose until you give the hand a different command. The hand moves to stay between you and the target, providing you with half cover against the target. The target can’t move through the hand’s space if its Strength score is less than or equal to the hand’s Strength score. If its Strength score is higher than the hand’s Strength score, the target can move toward you through the hand’s space, but that space is difficult terrain for the target.",
            "duration": "Concentration, up to 1 minute",
            "higher_levels": "When you cast this spell using a spell slot of 6th level or higher, the damage from the clenched fist option increases by 2d8 and the damage from the grasping hand increases by 2d6 for each slot level above 5th.",
            "level": "5",
            "name": "Arcane Hand",
            "range": "120 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "wizard",
                "level5"
            ],
            "type": "5th-level evocation"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "A sapphire worth 1,000 gp"
                ],
                "raw": "V, S, M (A sapphire worth 1,000 gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch an object weighing 10 pounds or less whose longest dimension is 6 feet or less. The spell leaves an invisible mark on its surface and invisibly inscribes the name of the item on the sapphire you use as the material component. Each time you cast this spell, you must use a different sapphire.\n\nAt any time thereafter, you can use your action to speak the item’s name and crush the sapphire. The item instantly appears in your hand regardless of physical or planar distances, and the spell ends.\n\nIf another creature is holding or carrying the item, crushing the sapphire doesn’t transport the item to you, but instead you learn who the creature possessing the object is and roughly where that creature is located at that moment.\n\nDispel magic or a similar effect successfully applied to the sapphire ends this spell’s effect.",
            "duration": "Until dispelled",
            "level": "6",
            "name": "Instant Summons",
            "range": "Touch",
            "ritual": true,
            "school": "conjuration",
            "tags": [
                "wizard",
                "level6"
            ],
            "type": "6th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "A piece of tentacle from a giant octopus or a giant squid"
                ],
                "raw": "V, S, M (A piece of tentacle from a giant octopus or a giant squid)",
                "somatic": true,
                "verbal": true
            },
            "description": "Squirming, ebony tentacles fill a 20-foot square on ground that you can see within range. For the duration, these tentacles turn the ground in the area into difficult terrain.\n\nWhen a creature enters the affected area for the first time on a turn or starts its turn there, the creature must succeed on a Dexterity saving throw or take 3d6 bludgeoning damage and be restrained by the tentacles until the spell ends. A creature that starts its turn in the area and is already restrained by the tentacles takes 3d6 bludgeoning damage.\n\nA creature restrained by the tentacles can use its action to make a Strength or Dexterity check (its choice) against your spell save DC. On a success, it frees itself.",
            "duration": "Concentration, up to 1 minute",
            "level": "4",
            "name": "Black Tentacles",
            "range": "90 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "wizard",
                "level4"
            ],
            "type": "4th-level conjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "An exquisite chest, 3 feet by 2 feet by 2 feet, constructed from rare materials worth at least 5,000 gp, and a Tiny replica made from the same materials worth at least 50 gp"
                ],
                "raw": "V, S, M (An exquisite chest, 3 feet by 2 feet by 2 feet, constructed from rare materials worth at least 5,000 gp, and a Tiny replica made from the same materials worth at least 50 gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "You touch an object weighing 10 pounds or less whose longest dimension is 6 feet or less. The spell leaves an invisible mark on its surface and invisibly inscribes the name of the item on the sapphire you use as the material component. Each time you cast this spell, you must use a different sapphire.\n\nAt any time thereafter, you can use your action to speak the item’s name and crush the sapphire. The item instantly appears in your hand regardless of physical or planar distances, and the spell ends.\n\nIf another creature is holding or carrying the item, crushing the sapphire doesn’t transport the item to you, but instead you learn who the creature possessing the object is and roughly where that creature is located at that moment.\n\nDispel magic or a similar effect successfully applied to the sapphire ends this spell’s effect.",
            "duration": "Instantaneous",
            "level": "4",
            "name": "Secret Chest",
            "range": "Touch",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "wizard",
                "level4"
            ],
            "type": "4th-level conjuration"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "wizard",
                "bard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "A small crystal bead"
                ],
                "raw": "V, S, M (A small crystal bead)",
                "somatic": true,
                "verbal": true
            },
            "description": "A 10-foot-radius immobile dome of force springs into existence around and above you and remains stationary for the duration. The spell ends if you leave its area.\n\nNine creatures of Medium size or smaller can fit inside the dome with you. The spell fails if its area includes a larger creature or more than nine creatures. Creatures and objects within the dome when you cast this spell can move through it freely. All other creatures and objects are barred from passing through it. Spells and other magical effects can’t extend through the dome or be cast through it. The atmosphere inside the space is comfortable and dry, regardless of the weather outside.\n\nUntil the spell ends, you can command the interior to become dimly lit or dark. The dome is opaque from the outside, of any color you choose, but it is transparent from the inside.",
            "duration": "8 hours",
            "level": "3",
            "name": "Tiny Hut",
            "range": "Self (10-foot-radius hemisphere)",
            "ritual": true,
            "school": "evocation",
            "tags": [
                "wizard",
                "level3",
                "bard"
            ],
            "type": "3th-level evocation"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "Powdered rhubarb leaf and an adder's stomach"
                ],
                "raw": "V, S, M (Powdered rhubarb leaf and an adder's stomach)",
                "somatic": true,
                "verbal": true
            },
            "description": "A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell Attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 3rd Level or higher, the damage (both initial and later) increases by 1d4 for each slot level above 2nd.",
            "level": "2",
            "name": "Acid Arrow",
            "range": "Self (10-foot-radius hemisphere)",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "wizard",
                "level2"
            ],
            "type": "2th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "A tiny silver whistle, a piece of bone, and a thread"
                ],
                "raw": "V, S, M (A tiny silver whistle, a piece of bone, and a thread)",
                "somatic": true,
                "verbal": true
            },
            "description": "You conjure a Phantom watchdog in an unoccupied space that you can see within range, where it remains for the Duration, until you dismiss it as an Action, or until you move more than 100 feet away from it.\n\nThe hound is Invisible to all Creatures except you and can’t be harmed. When a Small or larger creature comes within 30 feet of it without first speaking the password that you specify when you cast this spell, the hound starts barking loudly. The hound sees invisib⁠le Creatures and can see into the Ethereal Plane. It ignores illusions.\n\nAt the start of each of your turns, the hound attempts to bite one creature within 5 feet of it that is Hostile to you. The hound’s Attack bonus is equal to your Spellcasting ability modifier + your Proficiency bonus. On a hit, it deals 4d8 piercing damage.",
            "duration": "8 hours",
            "level": "4",
            "name": "Faithful Hound",
            "range": "30 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "wizard",
                "level4"
            ],
            "type": "4th-level conjuration"
        },
        {
            "casting_time": "1 minute",
            "classes": [
                "wizard",
                "bard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "A miniature portal carved from ivory, a small piece of polished marble, and a tiny silver spoon, each item worth at least 5 gp"
                ],
                "raw": "V, S, M (A miniature portal carved from ivory, a small piece of polished marble, and a tiny silver spoon, each item worth at least 5 gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "You conjure an extradimensional dwelling in range that lasts for the Duration. You choose where its one entrance is located. The entrance shimmers faintly and is 5 feet wide and 10 feet tall. You and any creature you designate when you cast the spell can enter the extradimensional dwelling as long as the portal remains open. You can open or close the portal if you are within 30 feet of it. While closed, the portal is Invisible.\n\nBeyond the portal is a magnificent foyer with numerous Chambers beyond. The Atmosphere is clean, fresh, and warm.\n\nYou can create any floor plan you like, but the space can’t exceed 50 cubes, each cube being 10 feet on each side. The place is furnished and decorated as you choose. It contains sufficient food to serve a nine-course banquet for up to 100 people. A staff of 100 near-transparent servants attends all who enter. You decide the visual Appearance of these servants and their attire. They are completely obedient to your orders. Each servant can perform any task a normal human servant could perform, but they can’t Attack or take any Action that would directly harm another creature. Thus the servants can fetch things, clean, mend, fold clothes, light fires, serve food, pour wine, and so on. The servants can go anywhere in the mansion but can’t leave it. Furnishings and other Objects created by this spell dissipate into smoke if removed from the mansion. When the spell ends, any Creatures or Objects left inside the extradimensional space are expelled into the open spaces nearest to the entrance.",
            "duration": "24 hours",
            "level": "7",
            "name": "Magnificent Mansion",
            "range": "300 feet",
            "ritual": false,
            "school": "conjuration",
            "tags": [
                "wizard",
                "level7",
                "bard"
            ],
            "type": "7th-level conjuration"
        },
        {
            "casting_time": "10 minutes",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "A thin sheet of lead, a piece of opaque glass, a wad of cotton or cloth, and powdered chrysolite"
                ],
                "raw": "V, S, M (A thin sheet of lead, a piece of opaque glass, a wad of cotton or cloth, and powdered chrysolite)",
                "somatic": true,
                "verbal": true
            },
            "description": "You make an area within range magically secure. The area is a cube that can be as small as 5 feet to as large as 100 feet on each side. The spell lasts for the Duration or until you use an Action to dismiss it.\n\nWhen you cast the spell, you decide what sort of security the spell provides, choosing any or all of the following properties:\n  • Sound can’t pass through the barrier at The Edge of the warded area.\n    • The barrier of the warded area appears dark and foggy, preventing Vision (including darkvision) through it.\n • Sensors created by Divination s⁠pells can’t appear inside the protected area or pass through the barrier at its perimeter.\n  • Creatures in the area can’t be targeted by d⁠ivination s⁠pells.\n • Nothing can Teleport into or out of the warded area.\n    • Planar Travel is blocked within the warded area.\n\nCasting this spell on the same spot every day for a year makes this Effect permanent.",
            "duration": "24 hours",
            "higher_levels": "When you cast this spell using a spell slot of 5th Level or higher, you can increase the size of the cube by 100 feet for each slot level beyond 4th. Thus you could protect a cube that can be up to 200 feet on one side by using a spell slot of 5th Level.",
            "level": "4",
            "name": "Private Sanctum",
            "range": "120 feet",
            "ritual": false,
            "school": "abjuration",
            "tags": [
                "wizard",
                "level4"
            ],
            "type": "4th-level abjuration"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard",
                "bard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "A miniature platinum sword with a grip and pommel of copper and zinc, worth 250 gp"
                ],
                "raw": "V, S, M (A miniature platinum sword with a grip and pommel of copper and zinc, worth 250 gp)",
                "somatic": true,
                "verbal": true
            },
            "description": "You create a sword-shaped plane of force that hovers within range. It lasts for the Duration.\n\nWhen the sword appears, you make a melee spell Attack against a target of your choice within 5 feet of the sword. On a hit, the target takes 3d10 force damage. Until the spell ends, you can use a bonus Action on each of your turns to move the sword up to 20 feet to a spot you can see and repeat this Attack against the same target or a different one.\n\nUntil the spell ends, you can use a b⁠onus Action on each of your turns to move the sword up to 20 feet to a spot you can see and repeat this Attack against the same target or a different one.",
            "duration": "Concentration, up to 1 minute",
            "level": "7",
            "name": "Arcane Sword",
            "range": "60 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "wizard",
                "level7",
                "bard"
            ],
            "type": "7th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "A small square of silk"
                ],
                "raw": "V, S, M (A small square of silk)",
                "somatic": true,
                "verbal": true
            },
            "description": "You place an Illusion on a creature or an object you touch so that Divination Spells reveal false information about it. The target can be a willing creature or an object that isn’t being carried or worn by another creature.\n\nWhen you cast the spell, choose one or both of the following Effects. The Effect lasts for the Duration. If you cast this spell on the same creature or object every day for 30 days, placing the same Effect on it each time, the i⁠llusion lasts until it is dispelled.\n\nFalse Aura. You change the way the target appears to Spells and Magical Effects, such as Detect Magic, that detect Magical auras. You can make a nonmagical object appear Magical, a Magical object appear nonmagical, or change the object’s Magical aura so that it appears to belong to a specific School of Magic that you choose. When you use this Effect on an object, you can make the false magic apparent to any creature that handles the item.\n\nMask. You change the way the target appears to Spells and Magical Effects that detect Creature Types, such as a paladin’s Divine Sense or the trigger of a sym⁠bol spell. You choose a Creature Type and other Spells and Magical Effects treat the target as if it were a creature of that type or of that Alignment.",
            "duration": "24 hours",
            "level": "2",
            "name": "Arcanist’s Magic Aura",
            "range": "Touch",
            "ritual": false,
            "school": "illusion",
            "tags": [
                "wizard",
                "level2"
            ],
            "type": "2th-level illusion"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard",
                "sorcerer"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "A small crystal sphere"
                ],
                "raw": "V, S, M (A small crystal sphere)",
                "somatic": true,
                "verbal": true
            },
            "description": "A frigid globe of cold energy streaks from your fingertips to a point of your choice within range, where it explodes in a 60-foot-radius Sphere. Each creature within the area must make a Constitution saving throw. On a failed save, a creature takes 10d6 cold damage. On a successful save, it takes half as much damage.\n\nIf the globe strikes a body of water or a liquid that is principally water (not including water-based creatures), it freezes the liquid to a depth of 6 inches over an area 30 feet square. This ice lasts for 1 minute. Creatures that were Swimming on the surface of frozen water are trapped in the ice. A trapped creature can use an Action to make a Strength check against your spell save DC to break free.\n\nYou can refrain from firing the globe after completing the spell, if you wish. A small globe about the size of a sling stone, cool to the touch, appears in your hand. At any time, you or a creature you give the globe to can throw the globe (to a range of 40 feet) or hurl it with a sling (to the sling’s normal range). It shatters on impact, with the same Effect as the normal casting of the spell. You can also set the globe down without shattering it. After 1 minute, if the globe hasn’t already shattered, it explodes.",
            "duration": "Instantaneous",
            "higher_levels": "When you cast this spell using a spell slot of 7th level or higher, the damage increases by 1d6 for each slot level above 6th.",
            "level": "6",
            "name": "Freezing Sphere",
            "range": "300 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "wizard",
                "level6",
                "sorcerer"
            ],
            "type": "6th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "materials_needed": [
                    "A hemispherical piece of clear crystal and a matching hemispherical piece of gum arabic"
                ],
                "raw": "V, S, M (A hemispherical piece of clear crystal and a matching hemispherical piece of gum arabic)",
                "somatic": true,
                "verbal": true
            },
            "description": "A s⁠phere of shimmering force encloses a creature or object of Large size or smaller within range. An unwilling creature must make a Dexterity saving throw. On a failed save, the creature is enclosed for the Duration.\n\nNothing—not physical Objects, energy, or other spell effects—can pass through the barrier, in or out, though a creature in the s⁠phere can breathe there. The s⁠phere is immune to all damage, and a creature or object inside can’t be damaged by Attacks or Effects originating from outside, nor can a creature inside the s⁠phere damage anything outside it.\n\nThe s⁠phere is weightless and just large enough to contain the creature or object inside. An enclosed creature can use its Action to push against the sphere’s walls and thus roll the s⁠phere at up to half the creature’s speed. Similarly, the globe can be picked up and moved by other Creatures.\n\nA Disintegrate spell targeting the globe destroys it without harming anything inside it.",
            "duration": "Concentration, up to 1 minute",
            "level": "4",
            "name": "Resilient Sphere",
            "range": "30 feet",
            "ritual": false,
            "school": "evocation",
            "tags": [
                "wizard",
                "level4"
            ],
            "type": "4th-level evocation"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard",
                "bard"
            ],
            "components": {
                "material": false,
                "raw": "V",
                "somatic": false,
                "verbal": true
            },
            "description": "Choose one creature that you can see within range. The target begins a comic dance in place: shuffling, tapping its feet, and capering for the Duration. Creatures that can’t be Charmed are immune to this spell.\n\nA Dancing creature must use all its Movement to dance without leaving its space and has disadvantage on Dexterity Saving Throws and Attack rolls. While the target is affected by this spell, other Creatures have advantage on a⁠ttack rolls against it. As an Action, a Dancing creature makes a Wisdom saving throw to regain control of itself. On a successful save, the spell ends.",
            "duration": "Concentration, up to 1 minute",
            "level": "6",
            "name": "Irresistible Dance",
            "range": "30 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "wizard",
                "level6",
                "bard"
            ],
            "type": "6th-level enchantment"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard",
                "bard"
            ],
            "components": {
                "material": true,
                "raw": "V, S, M (Pieces of eggshell from two different kinds of creatures)",
                "somatic": true,
                "verbal": true
            },
            "description": "You forge a Telepathic link among up to eight willing Creatures of your choice within range, psychically linking each creature to all the others for the Duration. Creatures with Intelligence scores of 2 or less aren’t affected by this spell.\n\nUntil the spell ends, the Targets can communicate telepathically through the bond whether or not they have a Common language. The Communication is possible over any distance, though it can’t extend to Other Planes of existence.",
            "duration": "1 hour",
            "level": "5",
            "name": "Telepathic Bond",
            "range": "30 feet",
            "ritual": true,
            "school": "divination",
            "tags": [
                "wizard",
                "level5",
                "bard"
            ],
            "type": "5th-level divination (ritual)"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard",
                "bard"
            ],
            "components": {
                "material": true,
                "raw": "V, S, M (Tiny tarts and a feather that is waved in the air)",
                "somatic": true,
                "verbal": true
            },
            "description": "A creature of your choice that you can see within range perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming Incapacitated and unable to stand up for the Duration. A creature with an Intelligence score of 4 or less isn’t affected.\n\nAt the end of each of its turns, and each time it takes damage, the target can make another Wisdom saving throw. The target has advantage on the saving throw if it’s triggered by damage. On a success, the spell ends.",
            "duration": "Concentration, up to 1 minute",
            "level": "1",
            "name": "Hideous Laughter",
            "range": "30 feet",
            "ritual": false,
            "school": "enchantment",
            "tags": [
                "wizard",
                "level1",
                "bard"
            ],
            "type": "1st-level divination"
        },
        {
            "casting_time": "1 action",
            "classes": [
                "wizard"
            ],
            "components": {
                "material": true,
                "raw": "V, S, M (A drop of mercury)",
                "somatic": true,
                "verbal": true
            },
            "description": "A creature of your choice that you can see within range perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming Incapacitated and unable to stand up for the Duration. A creature with an Intelligence score of 4 or less isn’t affected.\n\nAt the end of each of its turns, and each time it takes damage, the target can make another Wisdom saving throw. The target has advantage on the saving throw if it’s triggered by damage. On a success, the spell ends.",
            "duration": "1 hour",
            "level": "1",
            "name": "Floating Disk",
            "range": "30 feet",
            "ritual": true,
            "school": "conjuration",
            "tags": [
                "wizard",
                "level1"
            ],
            "type": "1st-level conjuration (ritual)"
        }
    ]

}
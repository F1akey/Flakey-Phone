let brightness = 100
let theme = 1
let notifications = 1

$(document).ready(() => {
    $(".bottom-container").hover(function() {
        if (theme == 1) {
            $(".bottom-home-btn").css("background-color", "rgba(255, 255, 255, 0.8)");
        } else {
            if ($(".app-container").css("display") == "none") {
                $(".bottom-home-btn").css("background-color", "rgba(0, 0, 0, 0.8)");
            } else {
                $(".bottom-home-btn").css("background-color", "rgba(255, 255, 255, 0.8)");
            }
        }
        $(".bottom-home-btn").fadeIn(250);
        }, function() {
            $(".bottom-home-btn").fadeOut(250);
        }
    );
    $(".bottom-home-btn").hover(function() {
        if (theme == 1) {
            $(".bottom-home-btn").css("background-color", "white");
        } else {
            if ($(".app-container").css("display") == "none") {
                $(".bottom-home-btn").css("background-color", "black");
            } else {
                $(".bottom-home-btn").css("background-color", "white");
            }
        }
        }, function() {
            if (theme == 1) {
                $(".bottom-home-btn").css("background-color", "rgba(255, 255, 255, 0.8)");
            } else {
                if ($(".app-container").css("display") == "none") {
                    $(".bottom-home-btn").css("background-color", "rgba(0, 0, 0, 0.8)");
                } else {
                    $(".bottom-home-btn").css("background-color", "rgba(255, 255, 255, 0.8)");
                }
            }
        }
    );
    $(".app").on("click", "", function () {
        if ($(this).hasClass("settings-icon")) {
            openApp(".settings-container");
            $(".setting-background").show();
        } else if ($(this).hasClass("garage-icon")) {
            $.post('https://nxt-phone/getVehicles', JSON.stringify({}));
            openApp(".garage-container");
            $(".garage-background").show();
        };
    });
    $(".home-btn").on("click", "", function () {
        goHome();
    });
    $('#brightness-range').on('input', function (e) {
        brightness = $(this).val();
        setBrightness(brightness)
    });
    $('#dark-radio').change(function() {
        themeColour(1)
    });
    $('#light-radio').change(function() {
        themeColour(2)
    });
    $('#notifications-checkbox-discovery').change(function() {
        if ($(this).prop("checked") == true) {
            setNotifications(1);
        } else if ($(this).prop("checked") == false) {
            setNotifications(2);
        };
    });
    
    window.addEventListener('message', function (event) {
        let data = event.data;
        if (data.open === true) {
            openPhone();
        };
        if (data.update === "Settings") {
            themeColour(data.theme);
            setBrightness(data.brightness);
            setNotifications(data.notifications);
        };
        if (data.update === "Garage") {
            populateGarageApp(data.vehicles)
        };
        if (data.update === "Time") {
            $(".phone-time").html(data.time);
        };
    });
});

document.onkeyup = function (data) {
    if (data.which == 27) {
        closePhone();
    };
};

function closePhone() {
    $.post('https://nxt-phone/close', JSON.stringify({}));
    $.post('https://nxt-phone/saveSettings', JSON.stringify({
        brightness: $('#brightness-range').val(),
        theme: theme,
        notifications: notifications
    }));
    $(".shell").animate({
        bottom: "-70vh",
    }, 500, function () {
    });
};

function openPhone() {
    $(".shell").animate({
        bottom: "1vh",
    }, 500, function () {
    });
};

function openApp(app) {
    $(".app-container").hide();
    $(app).show();
};

function goHome() {
    $(".app-container").show();
    $(".settings-container").hide();
    $(".setting-background").hide();
    $(".garage-container").hide();
    $(".garage-background").hide();
};

function setBrightness(val) {
    brightness = val;
    let filterFinal = "brightness(" + val + "%)";
    $('#brightness-range').val(val)
    $(".phone-time").css("filter", filterFinal);
    $(".phone-wifi").css("filter", filterFinal);
    $(".phone-battery").css("filter", filterFinal);
    $(".app").css("filter", filterFinal);
    $(".app-tag").css("filter", filterFinal);
    $(".setting-background").css("filter", filterFinal);
    $(".settings-container").css("filter", filterFinal);
    $(".garage-background").css("filter", filterFinal);
    $(".garage-container").css("filter", filterFinal);
};

function setNotifications(val) {
    notifications = val;
    if (notifications == 1) {
        $("#notifications-checkbox-discovery").prop("checked", true)
    } else if (notifications == 2) {
        $("#notifications-checkbox-discovery").prop("checked", false)
    };
};

function themeColour(mode) {
    theme = mode;
    settingsAppTheme(mode);
    garageAppTheme(mode);
    if (mode == 1) {
        $(".bottom-home-btn").css("background-color", "rgba(255, 255, 255, 0.8)");
        $(".phone-header").css("color", "white");
    } else if (mode == 2) {
        $(".bottom-home-btn").css("background-color", "rgba(0, 0, 0, 0.8)");
        $(".phone-header").css("color", "black");
    };
};

function settingsAppTheme(mode) {
    if (mode == 1) {
        $("#dark-radio").prop('checked', true);
        $(".setting-background").css("background-color", "black");
        $(".setting-background").css("border-color", "#111114");
        $(".appearance-container").css("background-color", "#211e22");
        $(".dark-title").css("color", "white");
        $(".light-title").css("color", "white");
        $(".settings-title").css("color", "white");
        $(".appearance-brightness").css("color", "white");
        $(".appearance-brightness").css("background-color", "#211e22");
        $(".appearance-notifications").css("color", "white");
        $(".appearance-notifications").css("background-color", "#211e22");
    } else if (mode == 2) {
        $("#light-radio").prop('checked', true);
        $(".setting-background").css("background-color", "#f1f0f9");
        $(".setting-background").css("border-color", "#fffeff");
        $(".appearance-container").css("background-color", "#fffeff");
        $(".dark-title").css("color", "black");
        $(".light-title").css("color", "black");
        $(".settings-title").css("color", "black");
        $(".appearance-brightness").css("background-color", "#fffeff");
        $(".appearance-brightness").css("color", "#979797");
        $(".appearance-notifications").css("background-color", "#fffeff");
        $(".appearance-notifications").css("color", "black");
    };
};

function garageAppTheme(mode) {
    if (mode == 1) {
        $(".garage-background").css("background-color", "black");
        $(".garage-background").css("border-color", "#111114");
        $(".garage-title").css("color", "white");
        $(".vehicle-item").css("background-color", "#111114");
        $(".vehicle-item").css("color", "white");
        $(".garage-vehicle-plate").css("color", "darkgray");
        $(".garage-vehicle-state").css("color", "white");
        $(".red-vehicle-item").css("background-color", "rgb(220, 45, 45)");
    } else if (mode == 2) {
        $(".garage-background").css("background-color", "#f1f0f9");
        $(".garage-background").css("border-color", "#fffeff");
        $(".garage-title").css("color", "black");
        $(".vehicle-item").css("background-color", "#fffeff");
        $(".vehicle-item").css("color", "black");
        $(".garage-vehicle-plate").css("color", "rgb(60, 60, 60)");
        $(".garage-vehicle-state").css("color", "black");
        $(".red-vehicle-item").css("background-color", "rgb(235, 70, 70)");
    };
};

function populateGarageApp(table) {
    $(".vehicles-holder").empty();
    $.each(table, function (index, value) {
        let state = value.state;
        let name = value.displayname;
        if (name == "CARNOTFOUND") {
            name = "IMPORT";
        }
        if (state == "Standard Impound" || state == "Police Impound") {
            $('.vehicles-holder').prepend(`
            <div class="vehicle-item red-vehicle-item">
                <span class="fas fa-car garage-car-icon"></span>
                <div class="garage-vehicle-name">${name}
                    <br>
                    <span class="garage-vehicle-plate">${value.plate}</span>
                </div>
                <div class="garage-vehicle-state">${value.state}</div>
            </div>
            `);
        } else {
            $('.vehicles-holder').prepend(`
            <div class="vehicle-item">
                <span class="fas fa-car garage-car-icon"></span>
                <div class="garage-vehicle-name">${name}
                    <br>
                    <span class="garage-vehicle-plate">${value.plate}</span>
                </div>
                <div class="garage-vehicle-state">(${value.state}) Garage ${value.garage}</div>
            </div>
            `);
        }
    });
    garageAppTheme(theme);
}
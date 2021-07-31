var children, sessionList;
var curr = 1;
var currS = 1;
var selected_user = null;
var selected_session = null;
var password = null;
var $user = $("#name");
var $session = $("#name-session");
var $pass = $("#login-password");

function show_error()
{
	console.log("error")
}
function show_message(msg)
{
	document.getElementById("login-response").innerHTML = msg;
}

function setup_users_list()
{
	var $list = $user;
    var to_append = null;
    $.each(lightdm.users, function (i) {
        var username = lightdm.users[i].name;
        var dispname = lightdm.users[i].display_name;
        $list.append(
            '<div id="'+username+'">'+dispname+'</div>'
        );
    });
    children = $("#name").children().length;
}

function select_user_from_list(idx, err)
{
	var idx = idx || 0;

	if(!err)
    	find_and_display_user_picture(idx);

    if(lightdm._username){
        lightdm.cancel_authentication();
    }

    selected_user = lightdm.users[idx].name;
    if(selected_user !== null) {
        start_authentication(selected_user);
    }

    $pass.trigger('focus');
}

function setup_session_list()
{
    var $listSession = $session;
    var to_append_session = null;
    $.each(lightdm.sessions, function (i) {
        var usernameS = lightdm.sessions[i].key;
        var dispnameS = lightdm.sessions[i].name;
        $listSession.append(
            '<div id="'+usernameS+'">'+dispnameS+'</div>'
        );
    });
    sessionList = $("#name-session").children().length;
}

function select_session_from_list(idx, err)
{
    var idx = idx || 0;

    selected_session = lightdm.sessions[idx].key;

    $pass.trigger('focus');
}


function start_authentication(username)
{
   lightdm.cancel_timed_login ();
   label = document.getElementById('countdown_label');
   if (label != null)
       label.style.visibility = "false";
	
	selected_user = username;
    lightdm.start_authentication(username);
    
    show_message("?");
}

function authentication_complete()
{
    if (lightdm.is_authenticated)
    	//lightdm.login (lightdm.authentication_user, lightdm.default_session); for lightdm-webkit-greeter
	lightdm.login (lightdm.authentication_user, lightdm.start_session_sync, selected_session); //lightdm-webkit2-greeter
    else
   	{
    	select_user_from_list(curr-1, true);
    	show_message ("Wrong Password!");
   	}

}

function find_and_display_user_picture(idx, z)
{
 	document.getElementById("login-picture").style.opacity = 0;

    setTimeout(function(){
    	$('#login-picture').attr(
        	'src',
        	lightdm.users[idx].image
    	);
    	document.getElementById("login-picture").addEventListener("load", function(){document.getElementById("login-picture").style.opacity = 1;});
    }, 350);
    
}

function provide_secret()
{
  	password = $pass.val() || null;
  	if(password !== null)
        lightdm.provide_secret(password);
}

function init()
{
    setup_users_list();
    select_user_from_list(0, false);
    setup_session_list();
    select_session_from_list();
    show_message ("&nbsp");

    $("#last").on('click', function(e) {
    	curr--;
	$pass.val("");
		if(curr <= 0)
			curr = children;
		if(children != 1) select_user_from_list(curr-1, false);
		$("#name").css("margin-left", -31-(265*(curr-1))+"px");
		show_message("&nbsp");
    });

    $("#next").on('click', function (e) {
    	curr++;
	$pass.val("");
		if(curr > children)
			curr = 1;
		if(children != 1) select_user_from_list(curr-1, false);
		$("#name").css("margin-left", -31-(265*(curr-1))+"px");
		show_message("&nbsp");
    });

    $("#last-session").on('click', function(e) {
    	currS--;
		if(currS <= 0)
			currS = sessionList;
		if(sessionList != 1) select_session_from_list(currS-1, false);
		$("#name-session").css("margin-left", -31-(265*(currS-1))+"px");
		show_message("&nbsp");
    });

    $("#next-session").on('click', function (e) {
    	currS++;
		if(currS > sessionList)
			currS = 1;
		if(sessionList != 1) select_session_from_list(currS-1, false);
		$("#name-session").css("margin-left", -31-(265*(currS-1))+"px");
		show_message("&nbsp");
    });


}

init();

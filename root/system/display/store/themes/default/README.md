# BellaDM Themes's manual

If you want to change/customize theme of BellaSDM, here are many things you could need:

1 Element, class, ID, base and their's role:
```
Subject							Attribute
-------------------------------------------------------------------------------------------
name			element			class			id			base			common
-------------------------------------------------------------------------------------------
body			body			body			(N/A) 		body			N/A
context			div				context			ctx 		context			N/A
login (div)		div				login			login_form	login 			N/A
username		input			usernameBox		username	usernameBox		input_inform
password		input			passworkBox		password	passwordBox		input_inform
env Select		select			envBox			env 		envBox			select_inform
submit			input(submit)	click			iClick		click 			submit_inform
additional elm  div				other			div			other 			N/A
login (form)	form			formlogon		N/A 		N/A 			N/A
super(body)		div				super			N/A 		N/A 			N/A
left			div 			left			l 			N/A 			N/A
right			div				right			r 			N/A 			N/A
header			div				header			N/A 		N/A  			N/A	
```
2 To load file from application's data, you use `/bellasdm/data?file=<fn>` and for theme's data, you use `/bellasdm/theme-data?file=<fn>`

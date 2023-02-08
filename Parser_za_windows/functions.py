import json

def getTechnologyType(num):
	'''
	function that returns type of internet connection based on refenece documents
	'''
	if(num==1):
		return "Optični priključek"
	elif(num==2):
		return "Koaksialni kabel"
	elif(num==3):
		return "Bakrena parica"
	elif(num==4): 
		return "Brezžično"
	else:
		return "Drugo"	
		
def calculatePercentage(dictio):
	'''
	Calculate percentaage for single groups
	'''
	sum=0
	newdict={}
	for key in dictio:
		sum+=int(dictio[key])
	for key in dictio:
		percentage =round(dictio[key]*100/sum,2)
		newdict.update({key:percentage})

	return newdict

def calculatePercentageGroup(dictio,first,second):
	'''
	Calculate percentage and group them into 3 categoryes
	'''
	sum=0
	name1="0-"+str(first-1)
	name2=str(first)+"-"+str(second-1)
	name3=str(second)+"+"

	newdict={name1:0,name2:0,name3:0}
	for key in dictio:
		sum+=int(dictio[key])
		value=int(dictio[key])
		key=float(key)
		if (key<first):
			newdict[name1]+=value
		elif(key>=first and key<second):
			newdict[name2]+=value
		else:
			newdict[name3]+=value
	newerdict={}
	for key in newdict:
		newerdict[key]=round(newdict[key]*100/sum,2)
	return newerdict
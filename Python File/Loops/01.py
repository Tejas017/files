# for i in range(0,5):
#     print(i*5)


# i =20
# while(i>=1):
#     print(i)
#     i-=2


list=[2,"Tejas",43,23.4,"A"]
i=len(list)
#print(i)
j=0
while(i>j):
    print(list[j])
    j+=1

#j=0 ,i=5 i>j->  5>0  list[0] j=j+1 -> j=0+1=1
#j=1   5>1  list[1]  j=1+1=2
#j=2   5>2  list[2] j=2+1=3
#j=3   5>3  list[3] j=3+1=4
#j=4   5>4  list[4] j=4+1=5
#j=5   5>5  false exit 

m=i-1  #m=5-1 =4 

while(m>=0):
    print(list[m])
    m-=1

#m=4   4>=0  list[4] m=m-1 -> m=4-1=3
#m=3   3>=0  list[3] m=3-1=2
#m=2   2>=0  list[2] m=2-1=1
#m=1   1>=0  list[1] m=1-1=0
#m=0   0>=0  list[0] m=0-1=-1
#m=-1  -1>=0  false exit 
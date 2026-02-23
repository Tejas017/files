# #tuple is immutable 

# a=(3,5,2,6,7,34,2,'Tejas')
# print(type(a))
# print(a)

# tup=(1,)
# print(tup)


fruitList=[]

for i in range(0,6):
    f=input("Please enter a fruit: ")
    fruitList.append(f)
else:
    print("Your list is as follows: ")
    print(fruitList)

fruitList.sort()
print(fruitList)


# marks=[]
# for i in range(0,4):
#     m=int(input("Please enter your marks: "))
#     marks.append(m)

# print(marks)
# marks.sort()
# print(marks)
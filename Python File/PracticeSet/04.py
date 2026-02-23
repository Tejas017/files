sub1=int(input("Please enter your marks: "))
sub2=int(input("Please enter your marks : "))
sub3=int(input("Please enter your marks: "))

percent=(sub1+sub2+sub3)/300*100

print(percent)

if(percent>=40.0 and sub1/100>33.0 and sub2/100>33.0 and sub3/100>33.0):
    print(f"Congratulations!! You are passed and your score is {percent}")

else:
    print("Sorry Better luck next time")


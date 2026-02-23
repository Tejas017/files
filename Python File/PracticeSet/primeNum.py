n=int(input("Please enter a number: "))

for i in range(2,n):
    if(n%i==0):
        print(f"The {n} number is not prime ")
        break

else:
    print(f"The {n} number is prime ")

def checkPrime(num):
    n=2
    flag=True
    while n<num:
        if num%n==0:
            flag=False
            break
        n+=1

    if flag:
        print("The number is prime")
    else:
        print("The number is not prime")
        
checkPrime(7)

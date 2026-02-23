# spamComments=[]
# # print(type(spamComments))

# spam_com_no=int(input("How many spam comments you have to insert: "))

# for i in range(0,spam_com_no):
#     comments=input("Please enter some spam comments : ").lower()
#     spamComments.append(comments)

# print(spamComments)

# spamComments=['free uc', 'buy this account', 'please follow this channel and supports us']

# comment=input("Please enter comments: ").lower()


# if any(com in comment for com in spamComments ):
#     print("This comment is spam!!")
#     print("Please dont spam in the chat")
# else:
#     print("this comment is not a spam")

# Buy this account Get free uc please follow this channel and supports us


p1="Make a lot of money"
p2="buy now"
p3="subscribe this"
p4="click this"

message=input("Enter your comment: ")

if((p1 in message)or(p2 in message)or(p3 in message)or(p4 in message)):
    print("This comment is spam!!")
    print("Please dont spam in the chat")
else:
    print("this comment is not a spam")




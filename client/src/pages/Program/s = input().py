s = input().lower()
dmhl = ["dzs","ssz","sz","zs","dz","cs","ly","gy","ny"]
mhl = "aeiou"
for i in dmhl:
    s = s.replace(i, "p")
for i in mhl:
    s = s.replace(i, " ")
s = s.split(" ")
for i in s[1:-1]:
    print(len(i), end=" ")
print()
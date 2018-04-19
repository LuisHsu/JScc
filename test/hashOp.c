#define hash_hash # ## #
#define mkstr(a) # a
#define concate(a, b) a ## b ## CON
#define in_between(a) mkstr(a)
#define join(c, d) in_between(c hash_hash d)
char p[] = join(x,y);

char concate(aoe,ppe)[] = mkstr(aoe);
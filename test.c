#define MTEST \
345
#define MPTEST(A, B, C) A + B * MTEST - C

#define MPTEST1(A, B, C,...) A + B * MTEST - C + __VA_ARGS__
int main(void){
	MTEST;
	int a = 3 + MPTEST1(1,2,3,MTEST);
	return 0;
}
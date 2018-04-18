#define MTEST \
345
#define MPTEST(A, B, C) A + B - C

#define MPTEST1(A, B, C,...) A + B - C
int main(void){
	int a = MTEST;
	return 0;
}
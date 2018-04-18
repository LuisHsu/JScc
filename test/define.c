#define MTEST 345
#define MTEST1 \
1008
#define MTEST2(A, B) A + B
#define MTEST3(...) 700-__VA_ARGS__
#define MTEST4(DD, ...) 426 + DD * MTEST1 + MTEST2(MTEST, 6) -__VA_ARGS__;
int main(void){
	int a = MTEST;
	MTEST1;
	MTEST2(2, MTEST);
	MTEST3('a');
	int c = MTEST4('v', 37, b = 23+4)
	return 0;
}
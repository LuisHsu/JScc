#define TEST

int main(void){

#ifdef TEST
	int a = 3;
#endif

#ifndef TEST
	int b = 3;
#else
	int c = 3;
#endif

#ifndef NTEST
	int d = 3;
#else
	int e = 3;
#endif

	return 0;
}
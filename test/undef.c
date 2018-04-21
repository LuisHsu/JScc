#define TEST tt

#ifdef TEST
	int testDefined;
#else
	int testNotDefined;
#endif

#undef TEST

#ifdef TEST
	int testStillDefined;
#else
	int testUndefined;
#endif

int main(void){

	return 0;
}
#if __STDC__
	int is_stdc;
#else
	int not_stdc;
#endif

#if __STDC_HOSTED__
	int is_stdc;
#else
	int not_hosted;
#endif

int v = __STDC_VERSION__;

int line = __LINE__;

int main(void){

	return 0;
}
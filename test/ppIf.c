
#if '\\' + '\''+ '\"' + '\?' + '\a' + '\b' + '\f' + '\n'+ '\r' + '\t' + '\v' + 'A'
	int Enter_if;
#endif

#if 3 - 3
	int Enter_if;
#else
	int Enter_else;
#endif

#if 3 - 3
	int Enter_if;
#else

# if 1
	int Enter_if_nested;
# endif
	int Enter_else;
#endif

#if 3 - 3
	int Enter_if;
#elif 2
	int Enter_elif;
# if 0
	int Enter_if_nested;
# else
	int Enter_else_nested;
# endif
#endif

#if 3 - 3
	int Enter_if;
#elif 0
	int Enter_elif;
#else
	int Enter_elif_else;
#endif

#if 3 - 3
	int Enter_if;
#elif 1
	int Enter_elif_if;
#else
	int Enter_elif_else;
#endif

#if 3 - 3
	int Enter_if;
#elif 1
	int Enter_elif_if;
#elif 1
	int Enter_elif_elif;
#else
	int Enter_elif_else;
#endif


#if 3 - 3
	int Enter_if;
#elif 0
	int Enter_elif_if;
#elif 1
	int Enter_elif_elif;
#else
	int Enter_elif_else;
#endif

int main(void){
	int a[3];
	return 0;
	
}
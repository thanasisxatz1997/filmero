#include <stdio.h>
#include <stdlib.h>
#include <time.h>
//#include <bits/stdc++.h>
//using namespace std;
//#include "MTgen.h"

void swap(long * a,long *b);
long * createArray(long n);
void fillArray(long *array,long n);
long* initArrASC(long *array,long n);
long* initArrDESC(long *p,long n);
void quickSort(long* p,long left,long right);
long partition(long *p,long left,long right);
void selectionSort(long *p,long n);
void insertionSort(long *p,long n); 
void shellSort(long *p,long n);
void CopyArray(long* startingArray,long* copiedArray,long n);
void PrintArray(long* array,long n);

int main(long argc, char *argv[]) {
int countMain=0;

for(countMain=0;countMain<2;countMain++){
long n,i;
long *array,*arrayASC,*arrayDESC,*arrayTemp;
float sortTimes[4][3];
clock_t t0,t1;
printf("Give me the size of Array\n");
scanf("%ld",&n);
printf("\n");
if(countMain==0){
	array=createArray(n);
	fillArray(array,n);
	arrayASC=initArrASC(array,n);
	arrayDESC=initArrDESC(arrayASC,n);
	arrayTemp=createArray(n);
}
else{
	arrayASC=initArrASC(array,n);
	arrayDESC=initArrDESC(arrayASC,n);	
}
//PrintArray(array,n);
//PrintArray(arrayASC,n);
//PrintArray(arrayDESC,n);

printf("SORT FOR ARRAY\n");
CopyArray(array,arrayTemp,n);
t0=clock();
printf("Before selection\n");
//PrintArray(array,n);
selectionSort(array,n);
//shellSort(array,n);
printf("After selection\n");
//PrintArray(array,n);
t1=clock();
sortTimes[0][0]=(float)(t1-t0)/CLOCKS_PER_SEC;
CopyArray(arrayTemp,array,n);

t0=clock();
printf("Before insertion\n");
insertionSort(array,n);
printf("After insertion\n");
t1=clock();
sortTimes[1][0]=(float)(t1-t0)/CLOCKS_PER_SEC;
CopyArray(arrayTemp,array,n);

t0=clock();
printf("Before shell\n");
shellSort(array,n);
printf("After shell\n");
t1=clock();
sortTimes[2][0]=(float)(t1-t0)/CLOCKS_PER_SEC;
CopyArray(arrayTemp,array,n);

t0=clock();
printf("Before quick\n");
quickSort(array,0,n-1);
printf("After quick\n");
t1=clock();
sortTimes[3][0]=(float)(t1-t0)/CLOCKS_PER_SEC;


printf("SORT FOR ARRAY ASC\n");
CopyArray(arrayASC,arrayTemp,n);
t0=clock();
printf("Before selection\n");
selectionSort(arrayASC,n);
printf("After selection\n");
t1=clock();
sortTimes[0][1]=(float)(t1-t0)/CLOCKS_PER_SEC;

t0=clock();
printf("After insertion\n");
insertionSort(arrayASC,n);
printf("Before insertion\n");
t1=clock();
sortTimes[1][1]=(float)(t1-t0)/CLOCKS_PER_SEC;
CopyArray(arrayTemp,arrayASC,n);

t0=clock();
printf("Before Shell\n");
shellSort(arrayASC,n);
printf("After Shell\n");
t1=clock();
sortTimes[2][1]=(float)(t1-t0)/CLOCKS_PER_SEC;
CopyArray(arrayTemp,arrayASC,n);

t0=clock();
printf("Before Quick\n");
quickSort(arrayASC,0,n-1);
printf("After Quick\n");
t1=clock();
sortTimes[3][1]=(float)(t1-t0)/CLOCKS_PER_SEC;


printf("SORT FOR ARRAY DESC\n");
CopyArray(arrayDESC,arrayTemp,n);
t0=clock();
printf("Before selection\n");
selectionSort(arrayDESC,n);
printf("After selection\n");
t1=clock();
sortTimes[0][2]=(float)(t1-t0)/CLOCKS_PER_SEC;
CopyArray(arrayTemp,arrayDESC,n);

t0=clock();
printf("Before insertion\n");
insertionSort(arrayDESC,n);
printf("After insertion\n");
t1=clock();
sortTimes[1][2]=(float)(t1-t0)/CLOCKS_PER_SEC;
CopyArray(arrayTemp,arrayDESC,n);

t0=clock();
printf("Before shell\n");
shellSort(arrayDESC,n);
printf("After shell\n");
t1=clock();
sortTimes[2][2]=(float)(t1-t0)/CLOCKS_PER_SEC;
CopyArray(arrayTemp,arrayDESC,n);

t0=clock();
printf("Before Quick\n");
quickSort(arrayDESC,0,n-1);
printf("After Quick\n");
t1=clock();
sortTimes[3][2]=(float)(t1-t0)/CLOCKS_PER_SEC;

FILE *fp;
if(countMain==0){
	fp=fopen("times.txt","w");
	fprintf(fp,"Array size: %ld\n-----------------------\n",n);
	fprintf(fp,"\t\tRandArray\tArrayASC\tArrayDESC\n");
	fprintf(fp,"Selection\t%f\t%f\t%f\n",sortTimes[0][0],sortTimes[0][1],sortTimes[0][2]);
	fprintf(fp,"Insertion\t%f\t%f\t%f\n",sortTimes[1][0],sortTimes[1][1],sortTimes[1][2]);
	fprintf(fp,"Shell\t\t%f\t%f\t%f\n",sortTimes[2][0],sortTimes[2][1],sortTimes[2][2]);
	fprintf(fp,"Quick\t\t%f\t%f\t%f\n\n",sortTimes[3][0],sortTimes[3][1],sortTimes[3][2]);
	fclose(fp);
}else{
	fp=fopen("times.txt","a");
	fprintf(fp,"Array size: %ld\n-----------------------\n",n);
	fprintf(fp,"\t\tRandArray\tArrayASC\tArrayDESC\n");
	fprintf(fp,"Selection\t%f\t%f\t%f\n",sortTimes[0][0],sortTimes[0][1],sortTimes[0][2]);
	fprintf(fp,"Insertion\t%f\t%f\t%f\n",sortTimes[1][0],sortTimes[1][1],sortTimes[1][2]);
	fprintf(fp,"Shell\t\t%f\t%f\t%f\n",sortTimes[2][0],sortTimes[2][1],sortTimes[2][2]);
	fprintf(fp,"Quick\t\t%f\t%f\t%f\n",sortTimes[3][0],sortTimes[3][1],sortTimes[3][2]);
	fclose(fp);
}
free(array);
free(arrayASC);
free(arrayDESC);
free(arrayTemp);
}

return 0;
}

void PrintArray(long* array,long n){
	long i;
	for(i=0;i<n;i++)
	{
		printf("%ld\n",array[i]);
	}
	printf("\n");
}

long* createArray(long n){
	long *array;
	long l=(long)n;
	array=(long*)malloc(l * sizeof(long));
	return array;
}

void fillArray(long *array,long n){
	long i;
	for (i=0;i<n;i++){
		array[i]=rand()%1000000+1;
	}
}

void CopyArray(long* startingArray,long* copiedArray,long n){
	long i;
	for (i=0;i<n;i++){
		copiedArray[i]=startingArray[i];
	}
}

long* initArrASC(long *array,long n){
	long *arrayASC;
	arrayASC=createArray(n);
	long i;
	CopyArray(array,arrayASC,n);
	quickSort(arrayASC,0,n-1);
	return arrayASC;
}

long* initArrDESC(long *arrayASC ,long n){
	long *arrayDESC;
	arrayDESC=createArray(n);
	long temp;
	CopyArray(arrayASC,arrayDESC,n);
	long i=0;
	for(i=0;i<n/2;i++){
		temp=arrayDESC[i];
		arrayDESC[i]=arrayDESC[n-1-i];
		arrayDESC[n-1-i]=temp;
	}
	return arrayDESC;
}

void swap(long* a, long* b) {  
    long t = *a;  
    *a = *b;  
    *b = t;  
}  

long partition(long *arr, long low, long high) {  
    long pivot = arr[high];  
    long i = (low - 1);  
  	long j;
    for (j = low; j <= high - 1; j++) {  
        if (arr[j] < pivot) {  
            i++;  
            swap(&arr[i], &arr[j]);  
        }  
    }  
    swap(&arr[i + 1], &arr[high]);  
    return (i + 1);  
}  

void quickSort(long *arr, long low, long high) {  
//	printf("%ld %ld",low,high);
    if (low < high) {  
        long pi = partition(arr, low, high);  
        quickSort(arr, low, pi - 1);  
        quickSort(arr, pi + 1, high);  
    }  
}  

void selectionSort(long *p,long N){
long i, j, minPos, min;
long long comparisons=0; 
for (i=0; i<N-1; i++) {
//	printf("%d\n",i);
  minPos = i;
  min = p[minPos];
for (j = i+1; j<N; j++) {
if (p[j] < min) {
  minPos = j;
min = p[minPos];
}

comparisons++;
}
  p[minPos] = p[i] ;
  p[i] = min;
  }
  printf("The comparisons of selection sort : %lld\n",comparisons);
}

void insertionSort(long *arr, long n){
    long i, key, j;
//    long comparisons=0;
    for (i = 1; i < n; i++) {
//    	printf("%d\n",i);
        key = arr[i];
        j = i - 1;
//        comparisons++;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
//            comparisons++;
        }
        arr[j + 1] = key;
    }
//    printf("The comparisons of insertion sort : %ld\n",comparisons);
}

void shellSort(long *p,long N){
long initlonger, longer, i, j, x,comps=0;
initlonger = N/2; 
  for(longer=initlonger; longer>0; longer=longer/2){ 
//  	printf("%ld\n",longer);
  	for(i=longer; i<N; i++){ 
		x = p[i]; 
		j = i - longer;
		while(j>=0 && x<p[j]){
 			p[j+longer] = p[j];
			j = j - longer;
			comps++;
  		}
  		p[j+longer] = x;
  	}
} 
printf("Done\n");
printf("comps: %ld",comps);
}
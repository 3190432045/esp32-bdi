
/*
// bdi.cpp
*/

/*
=================
last modified: 2024/2/23
=================
*/

#include <stdint.h>

#ifdef WIN32
#include <windows.h>
#else
#include <unistd.h>
#endif

typedef struct
{
    char state;
} bdi_port_t;



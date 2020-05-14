#!/bin/bash

# output from executing "node -v", typically requires a leading "v" character
REQUIRED_VERSION="v13.13.0"

CURRENT_VERSION="$(node -v)"

NODE_EXECUTABLE=$(which node)

if [ "$REQUIRED_VERSION" != "$CURRENT_VERSION" ]; then 

	echo "node.js needs to be [$REQUIRED_VERSION]."
	echo "node.js exectuable in path [$NODE_EXECUTABLE] is [$CURRENT_VERSION]."
	exit 1;
else

	echo "node.js is correct version [$REQUIRED_VERSION]"
	exit 0;
fi


# if [ "$(printf '%s\n' "$requiredver" "$currentver" | sort -V | head -n1)" = "$requiredver" ]; then 
#        echo "Greater than or equal to 5.0.0"
# else
#        echo "Less than 5.0.0"
# fi

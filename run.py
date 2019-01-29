import sys
import subprocess

theproc = subprocess.Popen("node index.js", shell = True)
theproc.communicate()     
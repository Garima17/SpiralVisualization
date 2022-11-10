#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Mar 16 11:17:58 2022

@author: garima
"""

import networkx as nx
import matplotlib.pyplot as plt
G =  nx.read_edgelist("facebook_combined.txt")
nx.draw(G)
plt.show()